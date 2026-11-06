import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import api from '../lib/api'
import { homePath, useAuth } from '../lib/auth'
import { FadeIn, MaskLine } from '../components/motion'
import { Button, Eyebrow, Field, Logo, TextLink, inputClass } from '../components/ui'

const DEMO_ACCOUNTS = [
  ['umkm@modalin.test', 'Pelaku usaha'],
  ['verifikator@modalin.test', 'Verifikator'],
  ['manajer@modalin.test', 'Manajer'],
  ['admin@modalin.test', 'Admin'],
]

function DemoAccounts({ onPick }) {
  return (
    <div className="grid gap-4">
      <Eyebrow className="text-night-muted">Akun demo · password: password</Eyebrow>
      <ul className="border-t border-night-line">
        {DEMO_ACCOUNTS.map(([email, role]) => (
          <li key={email}>
            <button type="button" onClick={() => onPick(email)}
              className="group flex min-h-13 w-full items-center justify-between gap-3 border-b border-night-line px-1 text-left hover:bg-night-line/60 hover:px-3">
              <span className="text-[14px] text-night-text">{email}</span>
              <span className="font-mono text-[11px] tracking-[0.1em] text-night-muted uppercase group-hover:text-ai-light">{role}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

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

  const pickDemo = (email) => {
    setForm({ email, password: 'password' })
    setErrors({})
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-12">
      <main className="flex flex-col px-5 py-8 sm:px-10 lg:col-span-6 lg:px-14">
        <Logo />
        <div className="my-auto w-full max-w-[400px] py-14">
          <Eyebrow>01 / Masuk</Eyebrow>
          <h1 className="mt-4 text-[40px] leading-[1.05] font-light tracking-[-0.04em] sm:text-[52px]">
            <MaskLine>Masuk ke</MaskLine>
            <MaskLine delay={120}>akun Anda<span className="text-ai">.</span></MaskLine>
          </h1>
          <p className="mt-4 text-[15px] leading-[1.7] text-ink-muted">Satu halaman masuk untuk pelaku usaha dan petugas.</p>

          <FadeIn delay={300}>
            <form onSubmit={submit} className="mt-10 grid gap-5" noValidate>
              {alert && <p className="border-l-2 border-beni bg-beni-soft px-4 py-3 text-[14px] text-beni" role="alert">{alert}</p>}
              <Field label="Email" error={errors.email}>
                <input type="email" autoComplete="username" value={form.email} aria-invalid={!!errors.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Password" error={errors.password}>
                <div className="flex border border-line-strong bg-surface transition-colors duration-400 hover:border-ink-muted has-focus:border-ink has-[[aria-invalid=true]]:border-beni">
                  <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={form.password} aria-invalid={!!errors.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} className="h-12 w-full bg-transparent px-3.5 text-[15px] outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="min-w-16 px-3 font-mono text-[11px] tracking-[0.1em] text-ink-subtle uppercase hover:text-ink"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
                    {showPassword ? 'Tutup' : 'Lihat'}
                  </button>
                </div>
              </Field>
              <Button type="submit" loading={loading} arrow className="mt-2 justify-between">Masuk</Button>
            </form>
            <p className="mt-8 text-[14px] text-ink-muted">
              Belum punya akun usaha? <TextLink to="/daftar">Daftarkan usaha</TextLink>
            </p>
          </FadeIn>
        </div>
        {import.meta.env.DEV && (
          <div className="-mx-5 bg-night px-5 py-8 sm:-mx-10 sm:px-10 lg:hidden"><DemoAccounts onPick={pickDemo} /></div>
        )}
      </main>

      <aside className="relative hidden flex-col justify-between overflow-hidden bg-night p-14 text-night-text lg:col-span-6 lg:flex">
        <FadeIn delay={600} as="p" lang="ja" aria-hidden="true" className="tategaki self-end text-[15px] text-night-muted">資金をつなぐ</FadeIn>
        <FadeIn delay={400} as="span" lang="ja" aria-hidden="true" className="pointer-events-none absolute -top-14 -left-6 font-mincho text-[320px] leading-none text-night-line select-none">資</FadeIn>
        <div className="relative grid max-w-md gap-10">
          <p className="text-[28px] leading-[1.2] font-light tracking-[-0.03em]">
            Setiap keputusan tercatat, dari pengajuan sampai jadwal cicilan.
          </p>
          {import.meta.env.DEV && <DemoAccounts onPick={pickDemo} />}
        </div>
      </aside>
    </div>
  )
}
