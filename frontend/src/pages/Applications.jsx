import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../lib/auth'
import { useApi } from '../lib/useApi'
import { REVIEWER, STATUS, formatDate, rupiah } from '../lib/format'
import { Button, Card, DataState, PageHeader, Pagination, StatusBadge, inputClass } from '../components/ui'

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
  const tabs = [['', 'Semua', total], ...Object.entries(STATUS).map(([key, s]) => [key, s.label, counts[key] ?? 0])]
  const rows = data?.data ?? []
  const canDecide = (status) => REVIEWER[status] === user.role

  return (
    <>
      <PageHeader title="Pengajuan masuk" text={`Anda memproses pengajuan berstatus "${STATUS[TASK[user.role]].label}".`} />

      <div className="mt-6 flex gap-1 overflow-x-auto overflow-y-hidden border-b border-line" role="tablist" aria-label="Filter status">
        {tabs.map(([key, label, count]) => (
          <button key={key} role="tab" aria-selected={filters.status === key} onClick={() => setFilter('status', key)}
            className={`flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm ${filters.status === key ? 'border-shu font-bold' : 'border-transparent text-ink-muted hover:text-ink'}`}>
            {label}<span className="rounded bg-paper-deep px-1.5 text-xs tabular-nums">{count}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kode atau nama usaha"
          aria-label="Cari kode atau nama usaha" className={`${inputClass} min-h-11 flex-1 sm:max-w-sm`} />
        <select value={filters.loan_product_id} onChange={(e) => setFilter('loan_product_id', e.target.value)} aria-label="Filter produk" className={`${inputClass} min-h-11 sm:w-auto`}>
          <option value="">Semua produk</option>
          {products.data?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <Card className="mt-4">
        <DataState loading={loading} error={error} onRetry={reload} empty={data ? rows.length === 0 : undefined}
          emptyTitle="Tidak ada pengajuan yang cocok" emptyText="Ubah kata kunci atau filter untuk melihat pengajuan lain."
          emptyAction={(filters.search || filters.loan_product_id || filters.status) && (
            <Button variant="outline" onClick={() => { setSearch(''); setFilters({ status: '', search: '', loan_product_id: '', page: 1 }) }}>Hapus filter</Button>
          )}>
          <div className="relative hidden overflow-x-auto xl:block">
            <table className="w-full text-sm tabular-nums">
              <thead className="border-b border-line text-left text-ink-muted">
                <tr>
                  <th className="px-5 py-3 font-normal">Kode</th><th className="px-5 py-3 font-normal">Usaha</th>
                  <th className="px-5 py-3 text-right font-normal">Jumlah</th><th className="px-5 py-3 font-normal">Tenor</th>
                  <th className="px-5 py-3 font-normal">Diajukan</th><th className="px-5 py-3 font-normal">Status</th>
                  <th className="px-5 py-3"><span className="sr-only">Aksi</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((loan) => (
                  <tr key={loan.id} className="hover:bg-paper">
                    <td className="px-5 py-3 font-bold whitespace-nowrap">{loan.code}</td>
                    <td className="px-5 py-3"><p className="font-bold">{loan.business.name}</p><p className="text-ink-muted">{loan.business.sector} · {loan.product.name}</p></td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">{rupiah(loan.amount)}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{loan.tenor_months} bln</td>
                    <td className="px-5 py-3 whitespace-nowrap">{formatDate(loan.created_at)}</td>
                    <td className="px-5 py-3"><StatusBadge status={loan.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <Link to={`/app/pengajuan/${loan.id}`} className="inline-flex min-h-11 items-center rounded-lg px-3 font-bold text-shu-deep hover:bg-shu-soft">
                        {canDecide(loan.status) ? 'Periksa' : 'Lihat'}
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
                <Link to={`/app/pengajuan/${loan.id}`} className="block px-4 py-4 hover:bg-paper">
                  <div className="flex items-start justify-between gap-3"><p className="text-sm font-bold text-shu-deep tabular-nums">{loan.code}</p><StatusBadge status={loan.status} /></div>
                  <p className="mt-1 font-bold">{loan.business.name}</p>
                  <p className="text-sm text-ink-muted tabular-nums">{rupiah(loan.amount)} · {loan.tenor_months} bln · {formatDate(loan.created_at)}</p>
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
