import { useState } from 'react'
import { Link, useParams } from 'react-router'
import api, { toast } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useApi } from '../lib/useApi'
import { MAX_REVENUE_MULTIPLIER, REVIEWER, formatDate, loanSteps, percent, rupiah } from '../lib/format'
import { Button, Card, ConfirmModal, Field, Message, Skeleton, StatusBadge, Timeline, inputClass } from '../components/ui'

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
    <section className="rounded-xl border-2 border-ink bg-surface p-6" aria-labelledby="decision-title">
      <h2 id="decision-title" className="text-lg font-bold">{action.title}</h2>
      <p className="mt-1 text-sm text-ink-muted">Keputusan Anda tercatat di riwayat dan audit log.</p>
      <Field label="Catatan" error={error} className="mt-4">
        <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} aria-invalid={!!error}
          placeholder="Wajib diisi jika menolak" className={`${inputClass} py-2`} />
      </Field>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => ask('rejected')}>Tolak</Button>
        <Button onClick={() => ask('approved')}>{action.approve}</Button>
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
    <Card title={real ? 'Jadwal cicilan' : 'Simulasi jadwal cicilan'} action={<p className="text-sm text-ink-muted tabular-nums">{rupiah(rows[0].amount)} / bulan</p>}>
      <div className="relative overflow-x-auto">
        <table className="mt-3 w-full min-w-[560px] text-sm tabular-nums">
          <thead className="border-y border-line text-left text-ink-muted">
            <tr>
              <th className="px-6 py-3 font-normal">Ke-</th>
              {real && <th className="px-6 py-3 font-normal">Jatuh tempo</th>}
              <th className="px-6 py-3 text-right font-normal">Pokok</th><th className="px-6 py-3 text-right font-normal">Bunga</th>
              <th className="px-6 py-3 text-right font-normal">Sisa pokok</th>
              {real && <th className="px-6 py-3 font-normal">Status</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((row) => (
              <tr key={row.number}>
                <td className="px-6 py-2.5">{row.number}</td>
                {real && <td className="px-6 py-2.5">{formatDate(row.due_date)}</td>}
                <td className="px-6 py-2.5 text-right">{rupiah(row.principal)}</td>
                <td className="px-6 py-2.5 text-right">{rupiah(row.interest)}</td>
                <td className="px-6 py-2.5 text-right">{rupiah(row.remaining_balance)}</td>
                {real && (
                  <td className="px-6 py-1.5">
                    {row.paid_at ? <span className="font-bold text-daun">Lunas</span>
                      : isAdmin ? <Button variant="ghost" className="px-3" loading={paying === row.id} onClick={() => pay(row)}>Tandai lunas</Button>
                      : <span className="text-ink-muted">Belum bayar</span>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 4 && (
        <div className="px-6 py-3">
          <button onClick={() => setShowAll(!showAll)} aria-expanded={showAll} className="inline-flex min-h-11 items-center text-sm font-bold text-shu-deep hover:underline">
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

  if (error) return <Message title={error.status === 404 ? 'Pengajuan tidak ditemukan' : 'Pengajuan gagal dimuat'} text={error.message} action={<Link to={back} className="font-bold text-shu-deep">Kembali</Link>} />
  if (!loan) return <Skeleton rows={6} />

  const ceiling = loan.monthly_revenue * MAX_REVENUE_MULTIPLIER
  const item = (label, value, wide) => (
    <div className={wide ? 'sm:col-span-2' : ''}><dt className="text-ink-muted">{label}</dt><dd className="mt-0.5 font-bold">{value}</dd></div>
  )

  return (
    <>
      <Link to={back} className="inline-flex min-h-11 items-center text-sm font-bold text-ink-muted hover:text-ink">Kembali ke daftar</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-shu-deep tabular-nums">{loan.code}</p>
          <h1 className="mt-1 text-3xl font-bold">{loan.business.name}</h1>
          <p className="mt-1 text-ink-muted">Diajukan {loan.business.user?.name}, {formatDate(loan.created_at)}</p>
        </div>
        <StatusBadge status={loan.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <Card title="Data pengajuan" className="pb-6">
            <dl className="mt-4 grid gap-x-6 gap-y-4 px-6 text-sm tabular-nums sm:grid-cols-2">
              {item('Produk', loan.product.name)}
              {item('Bunga', `${percent(loan.interest_rate)} per tahun`)}
              {item('Jumlah', rupiah(loan.amount))}
              {item('Tenor', `${loan.tenor_months} bulan`)}
              <div className="sm:col-span-2"><dt className="text-ink-muted">Tujuan</dt><dd className="mt-0.5">{loan.purpose}</dd></div>
            </dl>
          </Card>
          <Card title="Data usaha" className="pb-6">
            <dl className="mt-4 grid gap-x-6 gap-y-4 px-6 text-sm tabular-nums sm:grid-cols-2">
              {item('NIB', loan.business.nib)}
              {item('Sektor', loan.business.sector)}
              {item('Omzet bulanan saat mengajukan', rupiah(loan.monthly_revenue))}
              {item('Berdiri', loan.business.established_year)}
              <div className="sm:col-span-2"><dt className="text-ink-muted">Alamat</dt><dd className="mt-0.5">{loan.business.address}</dd></div>
            </dl>
            <p className={`mx-6 mt-5 rounded-lg px-4 py-3 text-sm ${loan.amount <= ceiling ? 'bg-daun-soft text-daun' : 'bg-shu-soft text-shu-deep'}`}>
              <b>{loan.amount <= ceiling ? 'Memenuhi plafon.' : 'Melebihi plafon.'}</b> {rupiah(loan.amount)} dari batas {rupiah(ceiling)} (3 x omzet).
            </p>
          </Card>
          <Schedule loan={loan} isAdmin={user.role === 'admin'} onPaid={reload} />
        </div>

        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          {REVIEWER[loan.status] === user.role && <Decision loan={loan} role={user.role} onDone={reload} />}
          <Card title="Riwayat" className="pb-6">
            <div className="mt-5 px-6"><Timeline steps={loanSteps(loan)} /></div>
          </Card>
        </div>
      </div>
    </>
  )
}
