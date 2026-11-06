import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import api, { toast } from '../lib/api'
import { homePath, useAuth } from '../lib/auth'
import { MAX_REVENUE_MULTIPLIER, SECTORS, rupiah } from '../lib/format'
import { MaskLine, Reveal, Rule } from '../components/motion'
import { Container } from '../components/site'
import { Button, Eyebrow, Field, Logo, MoneyInput, TextLink, inputClass, selectClass } from '../components/ui'

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

/** One numbered block of the form: caption on the left, fields on the right. */
function Section({ index, title, text, children }) {
  return (
    <div role="group" aria-labelledby={`section-${index}`} className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <Rule className="bg-ink lg:col-span-12" />
      <Reveal className="lg:col-span-4">
        <Eyebrow>{index}</Eyebrow>
        <h2 id={`section-${index}`} className="mt-3 text-[26px] font-light tracking-[-0.03em]">{title}</h2>
        <p className="mt-2 max-w-[300px] text-[14px] leading-[1.7] text-ink-muted">{text}</p>
      </Reveal>
      <Reveal delay={100} className="grid gap-5 sm:grid-cols-2 lg:col-span-8">{children}</Reveal>
    </div>
  )
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
    <>
      <header className="border-b border-line">
        <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <Logo />
          <p className="text-[14px] text-ink-muted">Sudah punya akun? <TextLink to="/masuk">Masuk</TextLink></p>
        </Container>
      </header>

      <main>
        <Container className="py-14 sm:py-20">
          <Eyebrow>Pendaftaran</Eyebrow>
          <h1 className="mt-4 text-[40px] leading-[1.05] font-light tracking-[-0.04em] sm:text-[60px]">
            <MaskLine>Daftarkan usaha Anda<span className="text-ai">.</span></MaskLine>
          </h1>
          <p className="mt-4 max-w-[520px] text-[15px] leading-[1.7] text-ink-muted">Setelah terdaftar, Anda bisa langsung mengajukan pembiayaan.</p>

          <form onSubmit={submit} noValidate className="mt-14 grid gap-14">
            <Section index="01" title="Akun pemilik" text="Dipakai untuk masuk dan menerima kabar tentang pengajuan.">
              <Field label="Nama lengkap" error={errors.name}>{input('name', { autoComplete: 'name' })}</Field>
              <Field label="Email" error={errors.email}>{input('email', { type: 'email', autoComplete: 'email' })}</Field>
              <Field label="Password" error={errors.password} hint="Minimal 8 karakter, berisi huruf dan angka.">{input('password', { type: 'password', autoComplete: 'new-password' })}</Field>
              <Field label="Ulangi password" error={errors.password_confirmation}>{input('password_confirmation', { type: 'password', autoComplete: 'new-password' })}</Field>
            </Section>

            <Section index="02" title="Data usaha" text={`Omzet bulanan menentukan plafon: paling banyak ${MAX_REVENUE_MULTIPLIER} kali omzet.`}>
              <Field label="Nama usaha" error={errors.business_name}>{input('business_name')}</Field>
              <Field label="NIB" error={errors.nib}>{input('nib', { inputMode: 'numeric', maxLength: 13 })}</Field>
              <Field label="Sektor" error={errors.sector}>
                <select value={form.sector} onChange={set('sector')} aria-invalid={!!errors.sector} className={selectClass}>
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
                <textarea rows={2} value={form.address} onChange={set('address')} aria-invalid={!!errors.address} className={`${inputClass} h-auto py-3`} />
              </Field>
            </Section>

            <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
              <Rule className="bg-ink lg:col-span-12" />
              <div className="lg:col-span-8 lg:col-start-5">
                <Button type="submit" loading={loading} arrow className="w-full justify-between sm:w-auto">Buat akun usaha</Button>
              </div>
            </div>
          </form>
        </Container>
      </main>
    </>
  )
}
