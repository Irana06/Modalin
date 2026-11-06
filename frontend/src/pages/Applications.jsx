import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../lib/auth'
import { useApi } from '../lib/useApi'
import { REVIEWER, STATUS, formatDate, rupiah } from '../lib/format'
import { Button, Card, DataState, Icon, PageHeader, Pagination, StatusBadge, Tabs, inputClass, selectClass } from '../components/ui'

const TASK = { verifikator: 'submitted', manajer: 'verified', admin: 'approved' }

export default function Applications() {
  const { user } = useAuth()
  const [filters, setFilters] = useState({ status: TASK[user.role], search: '', loan_product_id: '', page: 1 })
  const [search, setSearch] = useState('')
  const { data, loading, error, reload } = useApi('/loan-applications', filters)
  const products = useApi('/loan-products')

  useEffect(() => {
    const timer = setTimeout(() => setFilters((f) => (f.search === search ? f : { ...f, search, page: 1 })), 300)
    return () => clearTimeout(timer)
  }, [search])

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }))
  const counts = data?.counts ?? {}
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const tabs = [{ key: '', label: 'Semua', count: total }, ...Object.entries(STATUS).map(([key, s]) => ({ key, label: s.label, count: counts[key] ?? 0 }))]
  const rows = data?.data ?? []
  const canDecide = (status) => REVIEWER[status] === user.role

  return (
    <>
      <PageHeader eyebrow="Pengajuan masuk" title="Antrean pengajuan" text={`Anda memproses pengajuan berstatus "${STATUS[TASK[user.role]].label}".`} />

      <Tabs label="Filter status" items={tabs} value={filters.status} onChange={(key) => setFilter('status', key)} className="mt-6 border-b border-line" />

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative flex-1 sm:max-w-sm">
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kode atau nama usaha"
            aria-label="Cari kode atau nama usaha" className={`${inputClass} pl-10`} />
        </div>
        <select value={filters.loan_product_id} onChange={(e) => setFilter('loan_product_id', e.target.value)} aria-label="Filter produk" className={`${selectClass} sm:w-auto`}>
          <option value="">Semua produk</option>
          {products.data?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <Card className="mt-5">
        <DataState loading={loading} error={error} onRetry={reload} empty={data ? rows.length === 0 : undefined}
          emptyTitle="Tidak ada pengajuan yang cocok" emptyText="Ubah kata kunci atau filter untuk melihat pengajuan lain."
          emptyAction={(filters.search || filters.loan_product_id || filters.status) && (
            <Button variant="outline" onClick={() => { setSearch(''); setFilters({ status: '', search: '', loan_product_id: '', page: 1 }) }}>Hapus filter</Button>
          )}>
          <div className="relative hidden overflow-x-auto xl:block">
            <table className="w-full text-[14px] tabular-nums">
              <thead className="border-b border-ink text-left">
                <tr className="font-mono text-[11px] tracking-[0.12em] text-ink-subtle uppercase">
                  <th className="px-6 py-3.5 font-normal">Kode</th><th className="px-6 py-3.5 font-normal">Usaha</th>
                  <th className="px-6 py-3.5 text-right font-normal">Jumlah</th><th className="px-6 py-3.5 font-normal">Tenor</th>
                  <th className="px-6 py-3.5 font-normal">Diajukan</th><th className="px-6 py-3.5 font-normal">Status</th>
                  <th className="px-6 py-3.5"><span className="sr-only">Aksi</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((loan) => (
                  <tr key={loan.id} className="group hover:bg-paper-deep">
                    <td className="px-6 py-4 font-mono text-[13px] whitespace-nowrap">{loan.code}</td>
                    <td className="px-6 py-4"><p className="font-medium">{loan.business.name}</p><p className="text-[13px] text-ink-subtle">{loan.business.sector} · {loan.product.name}</p></td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">{rupiah(loan.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{loan.tenor_months} bln</td>
                    <td className="px-6 py-4 whitespace-nowrap text-ink-muted">{formatDate(loan.created_at)}</td>
                    <td className="px-6 py-4"><StatusBadge status={loan.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/app/pengajuan/${loan.id}`} className={`inline-flex h-10 items-center gap-2 px-4 text-[13px] font-medium [&_svg]:transition-transform [&_svg]:duration-500 hover:[&_svg]:translate-x-1 ${canDecide(loan.status) ? 'bg-ink text-paper hover:bg-ai' : 'text-ai hover:bg-ai-soft'}`}>
                        {canDecide(loan.status) ? 'Periksa' : 'Lihat'}<Icon name="arrow" className="size-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="divide-y divide-line xl:hidden">
            {rows.map((loan) => (
              <li key={loan.id}>
                <Link to={`/app/pengajuan/${loan.id}`} className="block px-5 py-5 hover:bg-paper-deep">
                  <div className="flex items-start justify-between gap-3"><p className="font-mono text-[13px] text-ai">{loan.code}</p><StatusBadge status={loan.status} /></div>
                  <p className="mt-2 text-[16px]">{loan.business.name}</p>
                  <p className="mt-0.5 text-[13px] text-ink-subtle tabular-nums">{rupiah(loan.amount)} · {loan.tenor_months} bln · {formatDate(loan.created_at)}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Pagination page={data} onPage={(page) => setFilters((f) => ({ ...f, page }))} />
        </DataState>
      </Card>
    </>
  )
}
