import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import api from '../lib/api'
import { homePath, useAuth } from '../lib/auth'
import { Button, Field, Logo, inputClass } from '../components/ui'

const DEMO_ACCOUNTS = [
  ['umkm@modalin.test', 'Pelaku usaha'],
  ['verifikator@modalin.test', 'Verifikator'],
  ['manajer@modalin.test', 'Manajer'],
  ['admin@modalin.test', 'Admin'],
]

export default function Login() {
  const { user, saveSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={homePath(user)} replace />

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.email) next.email = 'Email wajib diisi.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Format email tidak valid.'
    if (!form.password) next.password = 'Password wajib diisi.'
    setErrors(next)
    setAlert('')
    if (Object.keys(next).length) return

    setLoading(true)
    try {
      const res = await api.post('/login', form)
      saveSession(res.data)
      navigate(location.state?.from ?? homePath(res.data.user), { replace: true })
    } catch (err) {
      setErrors(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])))
      setAlert(err.status === 422 ? '' : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <main className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          <Logo />
          <h1 className="mt-8 text-3xl font-bold">Masuk ke akun Anda</h1>
          <p className="mt-2 text-ink-muted">Satu halaman masuk untuk pelaku usaha dan petugas.</p>
          <form onSubmit={submit} className="mt-8 grid gap-5" noValidate>
            {alert && <p className="rounded-lg border border-shu/30 bg-shu-soft px-4 py-3 text-sm text-shu-deep" role="alert">{alert}</p>}
            <Field label="Email" error={errors.email}>
              <input type="email" autoComplete="username" value={form.email} aria-invalid={!!errors.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Password" error={errors.password}>
              <div className="flex rounded-lg border border-line-strong bg-surface transition-colors hover:border-ink-muted has-[[aria-invalid=true]]:border-shu-deep">
                <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={form.password} aria-invalid={!!errors.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} className="min-h-12 w-full rounded-lg bg-transparent px-3 outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="min-w-16 px-3 text-sm font-bold text-ink-muted hover:text-ink"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
                  {showPassword ? 'Tutup' : 'Lihat'}
                </button>
              </div>
            </Field>
            <Button type="submit" loading={loading} className="min-h-12">Masuk</Button>
          </form>
          <p className="mt-6 text-sm text-ink-muted">
            Belum punya akun usaha? <Link to="/daftar" className="font-bold text-shu-deep hover:underline">Daftarkan usaha</Link>
          </p>
        </div>
      </main>
      {import.meta.env.DEV && (
        <aside className="kawung flex items-center px-4 py-12 sm:px-10">
          <div className="w-full max-w-md rounded-xl bg-surface p-6">
            <h2 className="text-lg font-bold">Akun demo dari seeder</h2>
            <p className="mt-1 text-sm text-ink-muted">Klik untuk mengisi form. Password semua akun: <code className="rounded bg-paper-deep px-1.5 py-0.5">password</code></p>
            <ul className="mt-4 grid gap-2">
              {DEMO_ACCOUNTS.map(([email, role]) => (
                <li key={email}>
                  <button type="button" onClick={() => setForm({ email, password: 'password' })}
                    className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-line px-3 py-2 text-left hover:border-ink">
                    <span className="text-sm">{email}</span><span className="shrink-0 text-xs font-bold text-ink-muted">{role}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  )
}
