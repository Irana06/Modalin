import { useState } from 'react'
import api, { toast } from '../../lib/api'
import { useApi } from '../../lib/useApi'
import { percent, rupiah } from '../../lib/format'
import { Button, Card, ConfirmModal, DataState, Field, Modal, MoneyInput, PageHeader, Pagination, inputClass } from '../../components/ui'

const EMPTY = { name: '', interest_rate: '', min_amount: 0, max_amount: 0, min_tenor: '', max_tenor: '', is_active: true }

function validate(f) {
  const e = {}
  if (!f.name.trim()) e.name = 'Nama produk wajib diisi.'
  if (f.interest_rate === '' || f.interest_rate < 0 || f.interest_rate > 50) e.interest_rate = 'Bunga antara 0 sampai 50%.'
  if (f.min_amount < 1_000_000) e.min_amount = 'Minimal Rp1.000.000.'
  if (f.max_amount < f.min_amount) e.max_amount = 'Harus lebih besar atau sama dengan jumlah minimal.'
  if (!f.min_tenor || f.min_tenor < 1) e.min_tenor = 'Tenor minimal 1 bulan.'
  if (!f.max_tenor || Number(f.max_tenor) < Number(f.min_tenor)) e.max_tenor = 'Harus lebih besar atau sama dengan tenor minimal.'
  return e
}

function ProductForm({ product, onSaved, onClose }) {
  const [form, setForm] = useState(product ?? EMPTY)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const set = (key, value) => setForm({ ...form, [key]: value })

  const submit = async (e) => {
    e.preventDefault()
    const next = validate(form)
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    try {
      const res = product ? await api.put(`/admin/loan-products/${product.id}`, form) : await api.post('/admin/loan-products', form)
      toast(res.message)
      onSaved()
    } catch (err) {
      setErrors(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Nama produk" error={errors.name} className="sm:col-span-2">
        <input value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} className={inputClass} />
      </Field>
      <Field label="Bunga per tahun (%)" error={errors.interest_rate}>
        <input type="number" step="0.1" value={form.interest_rate} onChange={(e) => set('interest_rate', e.target.value)} aria-invalid={!!errors.interest_rate} className={inputClass} />
      </Field>
      <label className="flex min-h-12 items-center gap-3 self-end">
        <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} className="size-5 accent-shu" />
        <span className="font-bold">Aktif untuk pengajuan</span>
      </label>
      <Field label="Jumlah minimal" error={errors.min_amount}><MoneyInput value={form.min_amount} onChange={(v) => set('min_amount', v)} invalid={!!errors.min_amount} /></Field>
      <Field label="Jumlah maksimal" error={errors.max_amount}><MoneyInput value={form.max_amount} onChange={(v) => set('max_amount', v)} invalid={!!errors.max_amount} /></Field>
      <Field label="Tenor minimal (bulan)" error={errors.min_tenor}>
        <input type="number" value={form.min_tenor} onChange={(e) => set('min_tenor', e.target.value)} aria-invalid={!!errors.min_tenor} className={inputClass} />
      </Field>
      <Field label="Tenor maksimal (bulan)" error={errors.max_tenor}>
        <input type="number" value={form.max_tenor} onChange={(e) => set('max_tenor', e.target.value)} aria-invalid={!!errors.max_tenor} className={inputClass} />
      </Field>
      <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
        <Button type="submit" loading={loading}>Simpan</Button>
      </div>
    </form>
  )
}

export default function Products() {
  const [params, setParams] = useState({ page: 1 })
  const { data, loading, error, reload } = useApi('/admin/loan-products', params)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const rows = data?.data ?? []

  const saved = () => { setEditing(null); reload() }
  const remove = async () => {
    setBusy(true)
    try {
      toast((await api.delete(`/admin/loan-products/${deleting.id}`)).message)
      reload()
    } finally {
      setBusy(false)
      setDeleting(null)
    }
  }

  return (
    <>
      <PageHeader title="Produk pembiayaan" text="Produk nonaktif tidak bisa dipilih di pengajuan baru. Pengajuan lama tetap memakai bunga saat diajukan.">
        <Button onClick={() => setEditing('new')}>Tambah produk</Button>
      </PageHeader>
      <Card className="mt-6">
        <DataState loading={loading} error={error} onRetry={reload} empty={data ? rows.length === 0 : undefined}
          emptyTitle="Belum ada produk" emptyText="Tambahkan produk agar pelaku usaha bisa mengajukan pembiayaan.">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm tabular-nums">
              <thead className="border-b border-line text-left text-ink-muted">
                <tr><th className="px-5 py-3 font-normal">Produk</th><th className="px-5 py-3 font-normal">Bunga</th><th className="px-5 py-3 font-normal">Jumlah</th><th className="px-5 py-3 font-normal">Tenor</th><th className="px-5 py-3 font-normal">Status</th><th className="px-5 py-3"><span className="sr-only">Aksi</span></th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3 font-bold">{p.name}</td>
                    <td className="px-5 py-3">{percent(p.interest_rate)}</td>
                    <td className="px-5 py-3">{rupiah(p.min_amount)} s.d. {rupiah(p.max_amount)}</td>
                    <td className="px-5 py-3">{p.min_tenor} s.d. {p.max_tenor} bln</td>
                    <td className="px-5 py-3">{p.is_active ? <span className="font-bold text-daun">Aktif</span> : <span className="text-ink-muted">Nonaktif</span>}</td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <Button variant="ghost" className="px-3" onClick={() => setEditing(p)}>Ubah</Button>
                      <Button variant="ghost" className="px-3" onClick={() => setDeleting(p)}>Hapus</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data} onPage={(page) => setParams({ page })} />
        </DataState>
      </Card>

      <Modal open={!!editing} title={editing === 'new' ? 'Tambah produk' : 'Ubah produk'} onClose={() => setEditing(null)}>
        {editing && <ProductForm product={editing === 'new' ? null : editing} onSaved={saved} onClose={() => setEditing(null)} />}
      </Modal>
      <ConfirmModal open={!!deleting} title={`Hapus ${deleting?.name}?`} danger loading={busy} confirmLabel="Ya, hapus"
        text="Produk disembunyikan dari pengajuan baru. Data pengajuan lama yang memakai produk ini tetap tersimpan."
        onConfirm={remove} onClose={() => setDeleting(null)} />
    </>
  )
}
