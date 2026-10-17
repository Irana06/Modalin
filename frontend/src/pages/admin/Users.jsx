import { useEffect, useState } from 'react'
import api, { toast } from '../../lib/api'
import { useAuth } from '../../lib/auth'
import { useApi } from '../../lib/useApi'
import { ROLE_LABEL } from '../../lib/format'
import { Button, Card, ConfirmModal, DataState, Field, Modal, PageHeader, Pagination, inputClass } from '../../components/ui'

const STAFF_ROLES = ['verifikator', 'manajer', 'admin']

function UserForm({ user, onSaved, onClose }) {
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', role: user?.role ?? 'verifikator', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Nama wajib diisi.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Masukkan email yang valid.'
    if ((!user || form.password) && (form.password.length < 8 || !/[a-z]/i.test(form.password) || !/\d/.test(form.password))) {
      next.password = 'Minimal 8 karakter, berisi huruf dan angka.'
    }
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    try {
      const res = user ? await api.put(`/admin/users/${user.id}`, form) : await api.post('/admin/users', form)
      toast(res.message)
      onSaved()
    } catch (err) {
      setErrors(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <Field label="Nama" error={errors.name}><input value={form.name} onChange={set('name')} aria-invalid={!!errors.name} className={inputClass} /></Field>
      <Field label="Email" error={errors.email}><input type="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} className={inputClass} /></Field>
      <Field label="Peran" error={errors.role}>
        <select value={form.role} onChange={set('role')} className={inputClass}>
          {STAFF_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
        </select>
      </Field>
      <Field label="Password" error={errors.password} hint={user ? 'Kosongkan jika tidak diganti.' : 'Minimal 8 karakter, berisi huruf dan angka.'}>
        <input type="password" autoComplete="new-password" value={form.password} onChange={set('password')} aria-invalid={!!errors.password} className={inputClass} />
      </Field>
      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
        <Button type="submit" loading={loading}>Simpan</Button>
      </div>
    </form>
  )
}

export default function Users() {
  const { user: me } = useAuth()
  const [params, setParams] = useState({ role: '', search: '', page: 1 })
  const [search, setSearch] = useState('')
  const { data, loading, error, reload } = useApi('/admin/users', params)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const rows = data?.data ?? []

  useEffect(() => {
    const timer = setTimeout(() => setParams((p) => (p.search === search ? p : { ...p, search, page: 1 })), 300)
    return () => clearTimeout(timer)
  }, [search])

  const saved = () => { setEditing(null); reload() }
  const remove = async () => {
    setBusy(true)
    try {
      toast((await api.delete(`/admin/users/${deleting.id}`)).message)
      reload()
    } finally {
      setBusy(false)
      setDeleting(null)
    }
  }

  return (
    <>
      <PageHeader title="Pengguna" text="Akun petugas dibuat di sini. Akun pelaku usaha dibuat lewat pendaftaran.">
        <Button onClick={() => setEditing('new')}>Tambah petugas</Button>
      </PageHeader>
      <div className="mt-6 flex flex-wrap gap-3">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau email" aria-label="Cari nama atau email" className={`${inputClass} min-h-11 flex-1 sm:max-w-sm`} />
        <select value={params.role} onChange={(e) => setParams({ ...params, role: e.target.value, page: 1 })} aria-label="Filter peran" className={`${inputClass} min-h-11 sm:w-auto`}>
          <option value="">Semua peran</option>
          {Object.entries(ROLE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <Card className="mt-4">
        <DataState loading={loading} error={error} onRetry={reload} empty={data ? rows.length === 0 : undefined}
          emptyTitle="Tidak ada pengguna yang cocok" emptyText="Ubah kata kunci atau filter peran.">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="border-b border-line text-left text-ink-muted">
                <tr><th className="px-5 py-3 font-normal">Nama</th><th className="px-5 py-3 font-normal">Email</th><th className="px-5 py-3 font-normal">Peran</th><th className="px-5 py-3"><span className="sr-only">Aksi</span></th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td className="px-5 py-3 font-bold">{u.name}{u.id === me.id && <span className="ml-2 text-xs font-normal text-ink-muted">(Anda)</span>}</td>
                    <td className="px-5 py-3">{u.email}</td>
                    <td className="px-5 py-3">{ROLE_LABEL[u.role]}</td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      {STAFF_ROLES.includes(u.role) && <Button variant="ghost" className="px-3" onClick={() => setEditing(u)}>Ubah</Button>}
                      {u.id !== me.id && <Button variant="ghost" className="px-3" onClick={() => setDeleting(u)}>Hapus</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data} onPage={(page) => setParams({ ...params, page })} />
        </DataState>
      </Card>

      <Modal open={!!editing} title={editing === 'new' ? 'Tambah petugas' : 'Ubah akun'} onClose={() => setEditing(null)}>
        {editing && <UserForm user={editing === 'new' ? null : editing} onSaved={saved} onClose={() => setEditing(null)} />}
      </Modal>
      <ConfirmModal open={!!deleting} title={`Hapus akun ${deleting?.name}?`} danger loading={busy} confirmLabel="Ya, hapus"
        text="Akun tidak bisa masuk lagi. Riwayat keputusan dan audit log yang terkait tetap tersimpan."
        onConfirm={remove} onClose={() => setDeleting(null)} />
    </>
  )
}
