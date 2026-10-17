import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import api, { toast } from '../lib/api'
import { homePath, useAuth } from '../lib/auth'
import { MAX_REVENUE_MULTIPLIER, SECTORS, rupiah } from '../lib/format'
import { Button, Field, Logo, MoneyInput, inputClass } from '../components/ui'

const EMPTY = {
  name: '', email: '', password: '', password_confirmation: '',
  business_name: '', nib: '', sector: '', address: '', monthly_revenue: 0, established_year: '',
}

function validate(f) {
  const e = {}
  if (!f.name.trim()) e.name = 'Nama wajib diisi.'
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Masukkan email yang valid.'
  if (f.password.length < 8 || !/[a-z]/i.test(f.password) || !/\d/.test(f.password)) e.password = 'Minimal 8 karakter, berisi huruf dan angka.'
  if (f.password_confirmation !== f.password) e.password_confirmation = 'Konfirmasi password tidak cocok.'
  if (!f.business_name.trim()) e.business_name = 'Nama usaha wajib diisi.'
  if (!/^\d{13}$/.test(f.nib)) e.nib = 'NIB terdiri dari 13 digit angka.'
  if (!f.sector) e.sector = 'Pilih sektor usaha.'
  if (!f.address.trim()) e.address = 'Alamat wajib diisi.'
  if (f.monthly_revenue < 1_000_000) e.monthly_revenue = 'Omzet bulanan minimal Rp1.000.000.'
  const year = Number(f.established_year)
  if (!year || year < 1950 || year > new Date().getFullYear()) e.established_year = 'Tahun berdiri tidak valid.'
  return e
}

export default function Register() {
  const { user, saveSession } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={homePath(user)} replace />

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const input = (key, props = {}) => (
    <input value={form[key]} onChange={set(key)} aria-invalid={!!errors[key]} className={inputClass} {...props} />
  )

  const submit = async (e) => {
    e.preventDefault()
    const next = validate(form)
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    try {
      const res = await api.post('/register', form)
      saveSession(res.data)
      toast('Akun usaha berhasil dibuat.')
      navigate('/app', { replace: true })
    } catch (err) {
      setErrors(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])))
      if (err.status === 429) toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Logo />
      <h1 className="mt-8 text-3xl font-bold">Daftarkan usaha Anda</h1>
      <p className="mt-2 text-ink-muted">Setelah terdaftar, Anda bisa langsung mengajukan pembiayaan.</p>

      <form onSubmit={submit} noValidate className="mt-8 grid gap-6">
        <fieldset className="grid gap-5 rounded-xl border border-line bg-surface p-6 sm:grid-cols-2">
          <legend className="px-1 font-display text-lg font-bold">Akun pemilik</legend>
          <Field label="Nama lengkap" error={errors.name}>{input('name', { autoComplete: 'name' })}</Field>
          <Field label="Email" error={errors.email}>{input('email', { type: 'email', autoComplete: 'email' })}</Field>
          <Field label="Password" error={errors.password} hint="Minimal 8 karakter, berisi huruf dan angka.">{input('password', { type: 'password', autoComplete: 'new-password' })}</Field>
          <Field label="Ulangi password" error={errors.password_confirmation}>{input('password_confirmation', { type: 'password', autoComplete: 'new-password' })}</Field>
        </fieldset>

        <fieldset className="grid gap-5 rounded-xl border border-line bg-surface p-6 sm:grid-cols-2">
          <legend className="px-1 font-display text-lg font-bold">Data usaha</legend>
          <Field label="Nama usaha" error={errors.business_name}>{input('business_name')}</Field>
          <Field label="NIB" error={errors.nib}>{input('nib', { inputMode: 'numeric', maxLength: 13 })}</Field>
          <Field label="Sektor" error={errors.sector}>
            <select value={form.sector} onChange={set('sector')} aria-invalid={!!errors.sector} className={inputClass}>
              <option value="">Pilih sektor</option>
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Tahun berdiri" error={errors.established_year}>{input('established_year', { inputMode: 'numeric', maxLength: 4 })}</Field>
          <Field label="Omzet bulanan rata-rata" error={errors.monthly_revenue}
            hint={form.monthly_revenue ? `Plafon pinjaman Anda: ${rupiah(form.monthly_revenue * MAX_REVENUE_MULTIPLIER)}` : 'Plafon pinjaman = 3 x omzet bulanan.'}>
            <MoneyInput value={form.monthly_revenue} onChange={(v) => setForm({ ...form, monthly_revenue: v })} invalid={!!errors.monthly_revenue} />
          </Field>
          <Field label="Alamat usaha" error={errors.address} className="sm:col-span-2">
            <textarea rows={2} value={form.address} onChange={set('address')} aria-invalid={!!errors.address} className={`${inputClass} py-3`} />
          </Field>
        </fieldset>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" loading={loading} className="min-h-12">Buat akun usaha</Button>
          <p className="text-sm text-ink-muted">Sudah punya akun? <Link to="/masuk" className="font-bold text-shu-deep hover:underline">Masuk</Link></p>
        </div>
      </form>
    </main>
  )
}
