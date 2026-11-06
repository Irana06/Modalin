import { Fragment, useState } from 'react'
import { useApi } from '../../lib/useApi'
import { ROLE_LABEL, formatDateTime } from '../../lib/format'
import { Button, Card, DataState, PageHeader, Pagination, selectClass } from '../../components/ui'

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
      <PageHeader eyebrow="Admin / Audit" title="Audit log" text="Semua perubahan data penting, terbaru di atas. Log tidak bisa diubah atau dihapus." />
      <select value={params.action} onChange={(e) => setParams({ action: e.target.value, page: 1 })} aria-label="Filter aksi" className={`${selectClass} mt-8 sm:w-auto`}>
        <option value="">Semua aksi</option>
        <option value="loan">Pengajuan</option>
        <option value="installment">Cicilan</option>
        <option value="product">Produk</option>
        <option value="user">Pengguna</option>
        <option value="auth">Login dan pendaftaran</option>
      </select>
      <Card className="mt-5">
        <DataState loading={loading} error={error} onRetry={reload} empty={data ? rows.length === 0 : undefined}
          emptyTitle="Belum ada log untuk aksi ini">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[860px] text-[14px]">
              <thead className="border-b border-ink text-left">
                <tr className="font-mono text-[11px] tracking-[0.12em] text-ink-subtle uppercase"><th className="px-6 py-3.5 font-normal">Waktu</th><th className="px-6 py-3.5 font-normal">Pengguna</th><th className="px-6 py-3.5 font-normal">Aksi</th><th className="px-6 py-3.5 font-normal">Objek</th><th className="px-6 py-3.5 font-normal">IP</th><th className="px-6 py-3.5"><span className="sr-only">Detail</span></th></tr>
              </thead>
              <tbody>
                {rows.map((log) => (
                  <Fragment key={log.id}>
                    <tr className="border-t border-line first:border-t-0 hover:bg-paper-deep">
                      <td className="px-6 py-4 whitespace-nowrap tabular-nums">{formatDateTime(log.created_at)}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{log.user?.name ?? 'Tamu'}</p>
                        <p className="text-[13px] text-ink-subtle">{log.user ? ROLE_LABEL[log.user.role] : 'Belum masuk'}</p>
                      </td>
                      <td className="px-6 py-4"><p>{ACTION_LABEL[log.action] ?? log.action}</p><code className="font-mono text-[11px] text-ink-subtle">{log.action}</code></td>
                      <td className="px-6 py-4 font-mono text-[13px]">{log.auditable?.code ?? log.auditable?.name ?? log.new_values?.email ?? '-'}</td>
                      <td className="px-6 py-4 font-mono text-[12px] text-ink-subtle">{log.ip_address}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" aria-expanded={open === log.id} onClick={() => setOpen(open === log.id ? null : log.id)}>
                          {open === log.id ? 'Tutup' : 'Detail'}
                        </Button>
                      </td>
                    </tr>
                    {open === log.id && (
                      <tr>
                        <td colSpan={6} className="animate-page-in bg-paper-deep/60 px-6 pt-1 pb-5">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div><p className="font-mono text-[11px] tracking-[0.12em] text-ink-subtle uppercase">Sebelum</p><pre className="mt-2 overflow-x-auto border border-line bg-surface p-3 font-mono text-[12px]">{json(log.old_values)}</pre></div>
                            <div><p className="font-mono text-[11px] tracking-[0.12em] text-ink-subtle uppercase">Sesudah</p><pre className="mt-2 overflow-x-auto border border-line bg-surface p-3 font-mono text-[12px]">{json(log.new_values)}</pre></div>
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
