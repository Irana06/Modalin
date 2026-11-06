import { useState } from 'react'
import { useNavigate } from 'react-router'
import api, { toast } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useApi } from '../lib/useApi'
import { ACTIVE_STATUSES, MAX_REVENUE_MULTIPLIER, percent, rupiah, schedule, tenorsFor } from '../lib/format'
import { Button, Card, Eyebrow, Field, LinkButton, MoneyInput, PageHeader, Skeleton, inputClass, selectClass } from '../components/ui'

export default function ApplyLoan() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const products = useApi('/loan-products')
  const loans = useApi('/loan-applications', { per_page: 1 })
  const [form, setForm] = useState({ loan_product_id: '', amount: 0, tenor_months: '', purpose: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (!products.data || !loans.data) return <Card><Skeleton /></Card>

  const active = loans.data.data.find((l) => ACTIVE_STATUSES.includes(l.status))
  if (active) {
    return (
      <>
        <PageHeader eyebrow="Pengajuan baru" title="Ajukan pembiayaan" />
        <Card className="mt-10 max-w-2xl p-6 sm:p-8">
          <h2 className="text-[22px] font-light tracking-[-0.02em]">Anda masih punya pengajuan yang berjalan</h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-ink-muted">
            Pengajuan <span className="font-mono text-[14px] text-ai">{active.code}</span> belum selesai. Pengajuan baru bisa dibuat setelah dana cair atau pengajuan itu ditolak.
          </p>
          <LinkButton to="/app" className="mt-6">Lihat status pengajuan</LinkButton>
        </Card>
      </>
    )
  }

  const ceiling = user.business.monthly_revenue * MAX_REVENUE_MULTIPLIER
  const product = products.data.find((p) => p.id === form.loan_product_id)
  const tenors = product ? tenorsFor(product) : []
  const preview = product && form.amount && form.tenor_months ? schedule(form.amount, product.interest_rate, Number(form.tenor_months)) : null
  const over = form.amount > ceiling

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value, ...(key === 'loan_product_id' && { tenor_months: '' }) }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!product) next.loan_product_id = 'Pilih salah satu produk.'
    if (!form.amount) next.amount = 'Jumlah pinjaman wajib diisi.'
    else if (over) next.amount = `Jumlah melebihi plafon ${rupiah(ceiling)} (3 x omzet bulanan).`
    else if (product && (form.amount < product.min_amount || form.amount > product.max_amount)) next.amount = `Untuk ${product.name}, jumlah harus ${rupiah(product.min_amount)} s.d. ${rupiah(product.max_amount)}.`
    if (!form.tenor_months) next.tenor_months = 'Pilih tenor.'
    if (form.purpose.trim().length < 20) next.purpose = 'Jelaskan tujuan penggunaan dana minimal 20 karakter.'
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    try {
      const res = await api.post('/loan-applications', form)
      toast(`${res.data.code} terkirim ke verifikator.`)
      navigate('/app')
    } catch (err) {
      setErrors(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])))
      if (err.status === 429) toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader eyebrow="Pengajuan baru" title="Ajukan pembiayaan" text="Pengajuan diperiksa verifikator, lalu diputuskan manajer." />
      <form onSubmit={submit} noValidate className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="grid content-start gap-7 p-6 sm:p-8">
          <fieldset>
            <legend className="text-[13px] font-medium">Produk pembiayaan</legend>
            <div className="mt-3 grid border-t border-line">
              {products.data.map((p) => (
                <label key={p.id} className="ink-wash group flex min-h-14 flex-wrap items-center justify-between gap-x-4 border-b border-line px-4 py-3 has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-ai">
                  <input type="radio" name="product" value={p.id} checked={form.loan_product_id === p.id} onChange={() => update('loan_product_id', p.id)} className="sr-only" />
                  <span className="flex items-center gap-3 text-[15px]"><span className="size-2 rounded-full border border-current group-has-checked:bg-ai-light group-has-checked:border-ai-light" />{p.name}</span>
                  <span className="font-mono text-[12px] text-ink-subtle tabular-nums group-has-checked:text-night-muted [@media(hover:hover)]:group-hover:text-night-muted">{percent(p.interest_rate)} / tahun · {rupiah(p.min_amount)} s.d. {rupiah(p.max_amount)}</span>
                </label>
              ))}
            </div>
            {errors.loan_product_id && <p className="mt-2 text-[13px] text-beni" role="alert">{errors.loan_product_id}</p>}
          </fieldset>
          <Field label="Jumlah pinjaman" error={errors.amount} hint={product ? `Batas produk ini ${rupiah(product.min_amount)} s.d. ${rupiah(product.max_amount)}.` : 'Pilih produk untuk melihat batas jumlah.'}>
            <MoneyInput value={form.amount} onChange={(v) => update('amount', v)} invalid={!!errors.amount} />
          </Field>
          <Field label="Tenor" error={errors.tenor_months}>
            <select value={form.tenor_months} onChange={(e) => update('tenor_months', e.target.value)} disabled={!product} aria-invalid={!!errors.tenor_months} className={selectClass}>
              <option value="">{product ? 'Pilih tenor' : 'Pilih produk dulu'}</option>
              {tenors.map((t) => <option key={t} value={t}>{t} bulan</option>)}
            </select>
          </Field>
          <Field label="Tujuan penggunaan dana" error={errors.purpose} hint={`${form.purpose.trim().length} / minimal 20 karakter`}>
            <textarea rows={4} value={form.purpose} onChange={(e) => update('purpose', e.target.value)} aria-invalid={!!errors.purpose}
              placeholder="Contoh: menambah stok bahan baku dan membeli kompor kedua untuk pesanan katering." className={`${inputClass} h-auto py-3`} />
          </Field>
        </Card>

        <Card className="grid content-start gap-6 self-start p-6 sm:p-8 lg:sticky lg:top-8">
          <div>
            <Eyebrow>Plafon Anda</Eyebrow>
            <p className="mt-3 text-[28px] leading-none font-light tracking-[-0.03em] tabular-nums">{rupiah(ceiling)}</p>
            <p className="mt-2 text-[13px] text-ink-subtle tabular-nums">Omzet {rupiah(user.business.monthly_revenue)} x 3</p>
            <div className="mt-5 h-1 overflow-hidden bg-paper-deep" role="progressbar" aria-label="Pemakaian plafon"
              aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(Math.min(form.amount / ceiling, 1) * 100)}>
              <div className={`h-full transition-[width,background-color] duration-700 ease-out-expo ${over ? 'bg-beni' : 'bg-ai'}`} style={{ width: `${Math.min(form.amount / ceiling, 1) * 100}%` }} />
            </div>
            <p className="mt-3 text-[13px] tabular-nums">
              {!form.amount ? 'Belum ada jumlah.' : over
                ? <span className="font-medium text-beni">Melebihi plafon {rupiah(form.amount - ceiling)}.</span>
                : <>Sisa plafon <span className="font-medium">{rupiah(ceiling - form.amount)}</span></>}
            </p>
          </div>
          <div className="border-t border-line pt-6">
            <Eyebrow>Estimasi cicilan per bulan</Eyebrow>
            <p key={preview?.payment} className="mt-3 animate-page-in text-[40px] leading-none font-light tracking-[-0.03em] tabular-nums">{rupiah(preview?.payment ?? 0)}</p>
            <p className="mt-2 text-[13px] text-ink-subtle tabular-nums">
              {preview ? `Total bunga ${rupiah(preview.totalInterest)} selama ${form.tenor_months} bulan` : 'Isi produk, jumlah, dan tenor.'}
            </p>
          </div>
          <Button type="submit" loading={loading} arrow className="justify-between">Kirim pengajuan</Button>
        </Card>
      </form>
    </>
  )
}
