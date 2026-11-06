import { Link } from 'react-router'
import { useAuth } from '../lib/auth'
import { useApi } from '../lib/useApi'
import { ACTIVE_STATUSES, MAX_REVENUE_MULTIPLIER, formatDate, loanSteps, rupiah } from '../lib/format'
import { Button, Card, DataState, Eyebrow, Icon, LinkButton, Message, PageHeader, Skeleton, StatusBadge, TextLink, Timeline } from '../components/ui'

function ActiveLoan({ id }) {
  const { data: loan, error, reload } = useApi(`/loan-applications/${id}`)
  if (error) return <Card><Message title="Detail pengajuan gagal dimuat" action={<Button variant="outline" onClick={reload}>Coba lagi</Button>} /></Card>
  if (!loan) return <Card><Skeleton rows={4} /></Card>

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="grid gap-1.5">
            <Eyebrow>Pengajuan aktif</Eyebrow>
            <p className="font-mono text-[13px] tracking-[0.06em] text-ai">{loan.code}</p>
            <h2 className="text-[22px] tracking-[-0.01em]">{loan.product.name}</h2>
            <p className="text-[14px] text-ink-subtle tabular-nums">{rupiah(loan.amount)} · {loan.tenor_months} bulan</p>
          </div>
          <StatusBadge status={loan.status} />
        </div>
        <div className="mt-6 border-t border-line pt-6"><Timeline steps={loanSteps(loan)} /></div>
        <TextLink to={`/app/pengajuan/${loan.id}`} className="mt-8 inline-block text-[14px]">Lihat detail dan jadwal cicilan</TextLink>
      </Card>
      <Card className="self-start p-6 sm:p-8">
        <Eyebrow>Estimasi cicilan</Eyebrow>
        <p className="mt-3 text-[40px] leading-none font-light tracking-[-0.03em] tabular-nums">{rupiah((loan.installments[0] ?? loan.schedule_preview[0]).amount)}</p>
        <p className="mt-2 text-[14px] text-ink-subtle">per bulan, selama {loan.tenor_months} bulan</p>
        <p className="mt-6 border-t border-line pt-5 text-[14px] leading-[1.7] text-ink-muted">Jadwal lengkap dengan tanggal jatuh tempo terbit setelah dana dicairkan.</p>
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
  const ceiling = business.monthly_revenue * MAX_REVENUE_MULTIPLIER

  return (
    <>
      <PageHeader eyebrow={business.name} title={`Halo, ${user.name.split(' ')[0]}.`} />

      <div className="mt-10">
        {data && (active ? <ActiveLoan id={active.id} /> : (
          <Card>
            <Message
              title={loans.length ? 'Tidak ada pengajuan yang berjalan' : 'Belum ada pengajuan'}
              text={`Plafon Anda saat ini ${rupiah(ceiling)}. Hitung cicilannya langsung di form pengajuan.`}
              action={<LinkButton to="/app/ajukan">Ajukan pembiayaan</LinkButton>}
            />
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card title="Riwayat pengajuan" eyebrow={`${String(loans.length).padStart(2, '0')} pengajuan`}>
          <div className="mt-5">
            <DataState loading={loading} error={error} onRetry={reload} empty={data ? loans.length === 0 : undefined}
              emptyTitle="Riwayat masih kosong" emptyText="Pengajuan yang pernah Anda kirim akan muncul di sini.">
              <ul className="border-t border-line">
                {loans.map((loan) => (
                  <li key={loan.id} className="border-b border-line last:border-b-0">
                    <Link to={`/app/pengajuan/${loan.id}`} className="group flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-paper-deep">
                      <div>
                        <p className="font-mono text-[13px] tracking-[0.04em]">{loan.code}</p>
                        <p className="mt-0.5 text-[13px] text-ink-subtle tabular-nums">{rupiah(loan.amount)} · diajukan {formatDate(loan.created_at)}</p>
                      </div>
                      <span className="flex items-center gap-3">
                        <StatusBadge status={loan.status} />
                        <Icon name="arrow" className="size-4 text-ink-subtle transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:text-ink" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </DataState>
          </div>
        </Card>
        <Card title="Profil usaha" eyebrow={business.sector} className="self-start pb-6">
          <dl className="mt-5 grid border-t border-line text-[14px] tabular-nums">
            {[['Omzet bulanan', rupiah(business.monthly_revenue)], ['Plafon maksimal', rupiah(ceiling)], ['NIB', business.nib]].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-line px-6 py-3.5">
                <dt className="text-ink-subtle">{label}</dt><dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </>
  )
}
