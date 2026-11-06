import { useState } from 'react'
import { Link, useParams } from 'react-router'
import api, { toast } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useApi } from '../lib/useApi'
import { MAX_REVENUE_MULTIPLIER, REVIEWER, formatDate, loanSteps, percent, rupiah } from '../lib/format'
import { Button, Card, ConfirmModal, Eyebrow, Field, Icon, Message, Skeleton, StatusBadge, TextLink, Timeline, inputClass } from '../components/ui'

const ACTION = {
  verifikator: { title: 'Verifikasi data usaha', approve: 'Lolos verifikasi', confirm: 'Pengajuan diteruskan ke manajer untuk diputuskan.' },
  manajer: { title: 'Persetujuan', approve: 'Setujui', confirm: 'Pengajuan diteruskan ke admin untuk pencairan dana.' },
  admin: { title: 'Pencairan dana', approve: 'Cairkan dana', confirm: 'Jadwal cicilan akan dibuat mulai bulan depan.' },
}

function Decision({ loan, role, onDone }) {
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(null)
  const [loading, setLoading] = useState(false)
  const action = ACTION[role]

  const ask = (decision) => {
    if (decision === 'rejected' && note.trim().length < 10) {
      setError('Tulis alasan penolakan minimal 10 karakter.')
      return
    }
    setError('')
    setConfirm(decision)
  }

  const send = async () => {
    setLoading(true)
    try {
      const res = await api.post(`/loan-applications/${loan.id}/decision`, { decision: confirm, note: note.trim() || null })
      toast(res.message)
      onDone()
    } catch (err) {
      setError(err.errors.note?.[0] ?? err.message)
    } finally {
      setLoading(false)
      setConfirm(null)
    }
  }

  return (
    <section className="border border-ink bg-surface p-6 shadow-[6px_6px_0_var(--color-ink)] sm:p-7" aria-labelledby="decision-title">
      <Eyebrow className="text-ai">Giliran Anda</Eyebrow>
      <h2 id="decision-title" className="mt-2 text-[22px] font-light tracking-[-0.02em]">{action.title}</h2>
      <p className="mt-1 text-[13px] text-ink-subtle">Keputusan Anda tercatat di riwayat dan audit log.</p>
      <Field label="Catatan" error={error} className="mt-4">
        <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} aria-invalid={!!error}
          placeholder="Wajib diisi jika menolak" className={`${inputClass} h-auto py-3`} />
      </Field>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => ask('rejected')} className="hover:border-beni hover:bg-beni">Tolak</Button>
        <Button arrow onClick={() => ask('approved')}>{action.approve}</Button>
      </div>
      <ConfirmModal
        open={!!confirm}
        title={confirm === 'rejected' ? 'Tolak pengajuan ini?' : `${action.approve}?`}
        text={confirm === 'rejected' ? 'Keputusan tidak bisa dibatalkan. Pelaku usaha akan melihat alasan Anda.' : `${loan.code}: ${action.confirm}`}
        confirmLabel={confirm === 'rejected' ? 'Ya, tolak' : `Ya, ${action.approve.toLowerCase()}`}
        danger={confirm === 'rejected'}
        loading={loading}
        onConfirm={send}
        onClose={() => setConfirm(null)}
      />
    </section>
  )
}

function Schedule({ loan, isAdmin, onPaid }) {
  const [showAll, setShowAll] = useState(false)
  const [paying, setPaying] = useState(null)
  const real = loan.installments.length > 0
  const rows = real ? loan.installments : loan.schedule_preview
  const visible = showAll ? rows : rows.slice(0, 4)
  const paidCount = rows.filter((row) => row.paid_at).length
  const nextUnpaid = rows.find((row) => !row.paid_at)?.number

  const pay = async (installment) => {
    setPaying(installment.id)
    try {
      const res = await api.post(`/admin/installments/${installment.id}/pay`)
      toast(res.message)
      onPaid()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setPaying(null)
    }
  }

  return (
    <Card title={real ? 'Jadwal cicilan' : 'Simulasi jadwal cicilan'} eyebrow="03"
      action={<p className="font-mono text-[12px] text-ink-subtle tabular-nums">{rupiah(rows[0].amount)} / bulan{real && ` · ${paidCount} dari ${rows.length} lunas`}</p>}>
      <div className="relative overflow-x-auto">
        <table className="mt-5 w-full min-w-[560px] text-[14px] tabular-nums">
          <thead className="border-y border-ink text-left">
            <tr className="font-mono text-[11px] tracking-[0.12em] text-ink-subtle uppercase">
              <th className="px-6 py-3 font-normal">Ke-</th>
              {real && <th className="px-6 py-3 font-normal">Jatuh tempo</th>}
              <th className="px-6 py-3 text-right font-normal">Pokok</th><th className="px-6 py-3 text-right font-normal">Bunga</th>
              <th className="px-6 py-3 text-right font-normal">Sisa pokok</th>
              {real && <th className="px-6 py-3 font-normal">Status</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((row) => (
              <tr key={row.number} className={row.paid_at ? 'text-ink-subtle' : real && row.number === nextUnpaid ? 'bg-ai-soft/50' : ''}>
                <td className="px-6 py-3 font-mono text-[12px]">{String(row.number).padStart(2, '0')}</td>
                {real && <td className="px-6 py-2.5 whitespace-nowrap">{formatDate(row.due_date)}</td>}
                <td className="px-6 py-2.5 text-right">{rupiah(row.principal)}</td>
                <td className="px-6 py-2.5 text-right">{rupiah(row.interest)}</td>
                <td className="px-6 py-2.5 text-right">{rupiah(row.remaining_balance)}</td>
                {real && (
                  <td className="px-6 py-1.5">
                    {row.paid_at ? <span className="inline-flex items-center gap-1.5 font-medium text-ink"><Icon name="check" className="size-3.5" strokeWidth={2.5} />Lunas</span>
                      : isAdmin && row.number === nextUnpaid ? <Button size="sm" loading={paying === row.id} onClick={() => pay(row)}>Tandai lunas</Button>
                      : <span className="text-ink-subtle">Belum bayar</span>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 4 && (
        <div className="border-t border-line px-6 py-4">
          <button onClick={() => setShowAll(!showAll)} aria-expanded={showAll} className="link-sweep text-[13px] font-medium text-ai hover:text-ai-deep">
            {showAll ? 'Tampilkan 4 bulan pertama' : `Tampilkan semua ${rows.length} bulan`}
          </button>
        </div>
      )}
    </Card>
  )
}

export default function ApplicationDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { data: loan, error, reload } = useApi(`/loan-applications/${id}`)
  const back = user.role === 'umkm' ? '/app' : '/app/pengajuan'

  if (error) return <Message title={error.status === 404 ? 'Pengajuan tidak ditemukan' : 'Pengajuan gagal dimuat'} text={error.message} action={<TextLink to={back}>Kembali</TextLink>} />
  if (!loan) return <Card><Skeleton rows={6} /></Card>

  const ceiling = loan.monthly_revenue * MAX_REVENUE_MULTIPLIER
  const item = (label, value, wide) => (
    <div className={wide ? 'sm:col-span-2' : ''}><dt className="text-[13px] text-ink-subtle">{label}</dt><dd className="mt-1 font-medium">{value}</dd></div>
  )

  return (
    <>
      <Link to={back} className="group inline-flex min-h-11 items-center gap-2 text-[13px] font-medium text-ink-muted hover:text-ink">
        <Icon name="arrow" className="size-3.5 rotate-180 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" />
        {user.role === 'umkm' ? 'Kembali ke beranda' : 'Kembali ke daftar pengajuan'}
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-6">
        <div className="grid gap-3">
          <p className="font-mono text-[13px] tracking-[0.06em] text-ai">{loan.code}</p>
          <h1 className="text-[32px] leading-[1.08] font-light tracking-[-0.035em] sm:text-[44px]">{loan.business.name}</h1>
          <p className="text-[14px] text-ink-subtle">Diajukan {loan.business.user?.name}, {formatDate(loan.created_at)}</p>
        </div>
        <StatusBadge status={loan.status} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <Card title="Data pengajuan" eyebrow="01" className="pb-6">
            <dl className="mt-5 grid gap-x-6 gap-y-5 px-6 text-[15px] tabular-nums sm:grid-cols-2">
              {item('Produk', loan.product.name)}
              {item('Bunga', `${percent(loan.interest_rate)} per tahun`)}
              {item('Jumlah', rupiah(loan.amount))}
              {item('Tenor', `${loan.tenor_months} bulan`)}
              <div className="sm:col-span-2"><dt className="text-[13px] text-ink-subtle">Tujuan</dt><dd className="mt-1 leading-[1.7] text-ink-muted">{loan.purpose}</dd></div>
            </dl>
          </Card>
          <Card title="Data usaha" eyebrow="02" className="pb-6">
            <dl className="mt-5 grid gap-x-6 gap-y-5 px-6 text-[15px] tabular-nums sm:grid-cols-2">
              {item('NIB', loan.business.nib)}
              {item('Sektor', loan.business.sector)}
              {item('Omzet bulanan saat mengajukan', rupiah(loan.monthly_revenue))}
              {item('Berdiri', loan.business.established_year)}
              <div className="sm:col-span-2"><dt className="text-[13px] text-ink-subtle">Alamat</dt><dd className="mt-1 text-ink-muted">{loan.business.address}</dd></div>
            </dl>
            <p className={`mx-6 mt-6 border-l-2 px-4 py-3 text-[14px] ${loan.amount <= ceiling ? 'border-ai bg-ai-soft text-ai-deep' : 'border-beni bg-beni-soft text-beni'}`}>
              <span className="font-medium">{loan.amount <= ceiling ? 'Memenuhi plafon.' : 'Melebihi plafon.'}</span> {rupiah(loan.amount)} dari batas {rupiah(ceiling)} (3 x omzet).
            </p>
          </Card>
        </div>

        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          {REVIEWER[loan.status] === user.role && <Decision loan={loan} role={user.role} onDone={reload} />}
          <Card title="Riwayat" eyebrow="Alur persetujuan" className="pb-6">
            <div className="mt-6 border-t border-line px-6 pt-6"><Timeline steps={loanSteps(loan)} /></div>
          </Card>
        </div>
      </div>
      {loan.status !== 'rejected' && <div className="mt-6"><Schedule loan={loan} isAdmin={user.role === 'admin'} onPaid={reload} /></div>}
    </>
  )
}
