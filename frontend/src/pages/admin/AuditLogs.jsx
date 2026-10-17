import { Fragment, useState } from 'react'
import { useApi } from '../../lib/useApi'
import { ROLE_LABEL, formatDateTime } from '../../lib/format'
import { Button, Card, DataState, PageHeader, Pagination, inputClass } from '../../components/ui'

const ACTION_LABEL = {
  'auth.login': 'Masuk', 'auth.registered': 'Mendaftar', 'auth.throttled': 'Login diblokir sementara',
  'loan.submitted': 'Mengajukan pembiayaan', 'loan.verified': 'Memverifikasi pengajuan', 'loan.approved': 'Menyetujui pengajuan',
  'loan.disbursed': 'Mencairkan dana', 'loan.rejected': 'Menolak pengajuan', 'installment.paid': 'Mencatat cicilan lunas',
  'product.created': 'Menambah produk', 'product.updated': 'Mengubah produk', 'product.deleted': 'Menghapus produk',
  'user.created': 'Menambah akun', 'user.updated': 'Mengubah akun', 'user.deleted': 'Menghapus akun',
}

const json = (value) => (value ? JSON.stringify(value, null, 2) : 'null')

export default function AuditLogs() {
  const [params, setParams] = useState({ action: '', page: 1 })
  const { data, loading, error, reload } = useApi('/admin/audit-logs', params)
  const [open, setOpen] = useState(null)
  const rows = data?.data ?? []

  return (
    <>
      <PageHeader title="Audit log" text="Semua perubahan data penting, terbaru di atas. Log tidak bisa diubah atau dihapus." />
      <select value={params.action} onChange={(e) => setParams({ action: e.target.value, page: 1 })} aria-label="Filter aksi" className={`${inputClass} mt-6 min-h-11 sm:w-auto`}>
        <option value="">Semua aksi</option>
        <option value="loan">Pengajuan</option>
        <option value="installment">Cicilan</option>
        <option value="product">Produk</option>
        <option value="user">Pengguna</option>
        <option value="auth">Login dan pendaftaran</option>
      </select>
      <Card className="mt-4">
        <DataState loading={loading} error={error} onRetry={reload} empty={data ? rows.length === 0 : undefined}
          emptyTitle="Belum ada log untuk aksi ini">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-line text-left text-ink-muted">
                <tr><th className="px-5 py-3 font-normal">Waktu</th><th className="px-5 py-3 font-normal">Pengguna</th><th className="px-5 py-3 font-normal">Aksi</th><th className="px-5 py-3 font-normal">IP</th><th className="px-5 py-3"><span className="sr-only">Detail</span></th></tr>
              </thead>
              <tbody>
                {rows.map((log) => (
                  <Fragment key={log.id}>
                    <tr className="border-t border-line first:border-t-0">
                      <td className="px-5 py-3 whitespace-nowrap tabular-nums">{formatDateTime(log.created_at)}</td>
                      <td className="px-5 py-3">
                        <p className="font-bold">{log.user?.name ?? 'Tamu'}</p>
                        <p className="text-ink-muted">{log.user ? ROLE_LABEL[log.user.role] : 'Belum masuk'}</p>
                      </td>
                      <td className="px-5 py-3"><p>{ACTION_LABEL[log.action] ?? log.action}</p><code className="text-xs text-ink-muted">{log.action}</code></td>
                      <td className="px-5 py-3 text-ink-muted tabular-nums">{log.ip_address}</td>
                      <td className="px-5 py-3 text-right">
                        <Button variant="ghost" className="px-3" aria-expanded={open === log.id} onClick={() => setOpen(open === log.id ? null : log.id)}>
                          {open === log.id ? 'Tutup' : 'Detail'}
                        </Button>
                      </td>
                    </tr>
                    {open === log.id && (
                      <tr>
                        <td colSpan={5} className="px-5 pb-4">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div><p className="text-xs font-bold text-ink-muted">Sebelum</p><pre className="mt-1 overflow-x-auto rounded-lg bg-paper-deep p-3 text-xs">{json(log.old_values)}</pre></div>
                            <div><p className="text-xs font-bold text-ink-muted">Sesudah</p><pre className="mt-1 overflow-x-auto rounded-lg bg-paper-deep p-3 text-xs">{json(log.new_values)}</pre></div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data} onPage={(page) => setParams({ ...params, page })} />
        </DataState>
      </Card>
    </>
  )
}
