import { Link } from 'react-router'
import { useAuth } from '../lib/auth'
import { useApi } from '../lib/useApi'
import { ACTIVE_STATUSES, MAX_REVENUE_MULTIPLIER, formatDate, loanSteps, rupiah } from '../lib/format'
import { Card, DataState, Message, Skeleton, StatusBadge, Timeline } from '../components/ui'

function ActiveLoan({ id }) {
  const { data: loan, error, reload } = useApi(`/loan-applications/${id}`)
  if (error) return <Message title="Detail pengajuan gagal dimuat" action={<button onClick={reload} className="font-bold text-shu-deep">Coba lagi</button>} />
  if (!loan) return <Skeleton rows={4} />

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Card className="p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-shu-deep tabular-nums">{loan.code}</p>
            <h2 className="mt-1 text-2xl font-bold">Pengajuan aktif</h2>
            <p className="mt-1 text-ink-muted tabular-nums">{loan.product.name} · {rupiah(loan.amount)} · {loan.tenor_months} bulan</p>
          </div>
          <StatusBadge status={loan.status} />
        </div>
        <div className="mt-6 border-t border-line pt-6"><Timeline steps={loanSteps(loan)} /></div>
        <Link to={`/app/pengajuan/${loan.id}`} className="mt-6 inline-flex min-h-11 items-center font-bold text-shu-deep hover:underline">Lihat detail dan jadwal cicilan</Link>
      </Card>
      <Card className="self-start p-6">
        <h2 className="text-lg font-bold">Estimasi cicilan</h2>
        <p className="mt-2 font-display text-3xl font-bold tabular-nums">{rupiah((loan.installments[0] ?? loan.schedule_preview[0]).amount)}</p>
        <p className="text-sm text-ink-muted">per bulan, selama {loan.tenor_months} bulan</p>
        <p className="mt-4 text-sm text-ink-muted">Jadwal lengkap dengan tanggal jatuh tempo terbit setelah dana dicairkan.</p>
      </Card>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { data, loading, error, reload } = useApi('/loan-applications', { per_page: 50 })
  const business = user.business
  const loans = data?.data ?? []
  const active = loans.find((l) => ACTIVE_STATUSES.includes(l.status))

  return (
    <>
      <p className="text-ink-muted">{business.name}</p>
      <h1 className="mt-1 text-3xl font-bold">Halo, {user.name.split(' ')[0]}</h1>

      <div className="mt-8">
        {data && (active ? <ActiveLoan id={active.id} /> : (
          <Card>
            <Message
              title={loans.length ? 'Tidak ada pengajuan yang berjalan' : 'Belum ada pengajuan'}
              text={`Plafon Anda saat ini ${rupiah(business.monthly_revenue * MAX_REVENUE_MULTIPLIER)}. Hitung cicilannya langsung di form pengajuan.`}
              action={<Link to="/app/ajukan" className="inline-flex min-h-11 items-center rounded-lg bg-shu px-5 font-bold text-surface hover:bg-shu-deep">Ajukan pembiayaan</Link>}
            />
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card title="Riwayat pengajuan">
          <div className="mt-3">
            <DataState loading={loading} error={error} onRetry={reload} empty={data ? loans.length === 0 : undefined}
              emptyTitle="Riwayat masih kosong" emptyText="Pengajuan yang pernah Anda kirim akan muncul di sini.">
              <ul className="divide-y divide-line border-t border-line">
                {loans.map((loan) => (
                  <li key={loan.id}>
                    <Link to={`/app/pengajuan/${loan.id}`} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-paper">
                      <div>
                        <p className="font-bold tabular-nums">{loan.code}</p>
                        <p className="text-sm text-ink-muted tabular-nums">{rupiah(loan.amount)} · diajukan {formatDate(loan.created_at)}</p>
                      </div>
                      <StatusBadge status={loan.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </DataState>
          </div>
        </Card>
        <Card title="Profil usaha" className="self-start pb-6">
          <dl className="mt-4 grid gap-3 px-6 text-sm tabular-nums">
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">Omzet bulanan</dt><dd className="font-bold">{rupiah(business.monthly_revenue)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">Plafon maksimal</dt><dd className="font-bold">{rupiah(business.monthly_revenue * MAX_REVENUE_MULTIPLIER)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">NIB</dt><dd className="font-bold">{business.nib}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-muted">Sektor</dt><dd className="font-bold">{business.sector}</dd></div>
          </dl>
        </Card>
      </div>
    </>
  )
}
