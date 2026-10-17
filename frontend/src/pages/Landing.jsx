import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth, homePath } from '../lib/auth'
import { useApi } from '../lib/useApi'
import { percent, rupiah, schedule, tenorsFor } from '../lib/format'
import { Logo, MoneyInput, StatusBadge, Timeline, inputClass } from '../components/ui'

const SAMPLE_STEPS = [
  { title: 'Diajukan', date: '2026-10-03', by: 'Pemilik usaha', state: 'done' },
  { title: 'Verifikasi data usaha', date: '2026-10-06', by: 'Verifikator', note: 'NIB dan omzet sesuai dokumen.', state: 'done' },
  { title: 'Persetujuan manajer', state: 'current' },
  { title: 'Pencairan dana', state: 'todo' },
]

const FLOW = [
  ['Pelaku usaha', 'Mengajukan pembiayaan', 'Isi profil usaha, pilih produk, jumlah, dan tenor. Jumlah di atas 3 kali omzet bulanan langsung ditolak sistem.'],
  ['Verifikator', 'Memeriksa data usaha', 'NIB, omzet, dan tujuan penggunaan dana dicocokkan. Penolakan selalu disertai alasan.'],
  ['Manajer', 'Memberi persetujuan', 'Manajer hanya melihat pengajuan yang sudah lolos verifikasi.'],
  ['Admin', 'Mencairkan dana', 'Jadwal cicilan lengkap terbit saat dana dicairkan, lengkap dengan tanggal jatuh tempo.'],
]

const scrollTo = (id) => document.getElementById(id).scrollIntoView({ behavior: 'smooth' })

function Simulator({ products }) {
  const [productId, setProductId] = useState('')
  const [amount, setAmount] = useState(25_000_000)
  const [tenor, setTenor] = useState(12)
  const product = products.find((p) => p.id === productId) ?? products[0]

  useEffect(() => {
    if (!product) return
    setAmount((a) => Math.min(Math.max(a, product.min_amount), product.max_amount))
    setTenor((t) => Math.min(Math.max(t, product.min_tenor), product.max_tenor))
  }, [product])

  if (!product) return null
  const tenors = tenorsFor(product)
  const valid = amount >= product.min_amount && amount <= product.max_amount
  const principal = Math.min(Math.max(amount, product.min_amount), product.max_amount)
  const result = schedule(principal, product.interest_rate, tenor)

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:py-20">
      <div>
        <h2 className="text-3xl font-bold sm:text-4xl">Hitung cicilan sebelum mengajukan.</h2>
        <p className="mt-4 max-w-md leading-relaxed text-night-muted">
          Cicilan memakai metode anuitas: jumlah bayar sama setiap bulan, porsi bunga mengecil seiring sisa pokok berkurang.
        </p>
        <div className="mt-8 grid gap-5 text-ink">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-cream">Produk</span>
            <select value={product.id} onChange={(e) => setProductId(e.target.value)} className={inputClass}>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({percent(p.interest_rate)} / tahun)</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold text-cream">Jumlah pinjaman</span>
            <MoneyInput value={amount} onChange={setAmount} invalid={!valid} />
            <input type="range" min={product.min_amount} max={product.max_amount} step={1_000_000} value={amount}
              onChange={(e) => setAmount(Number(e.target.value))} className="accent-shu" aria-label="Geser jumlah pinjaman" />
            <span className={`text-sm tabular-nums ${valid ? 'text-night-muted' : 'font-bold text-cream'}`} aria-live="polite">
              {valid ? `${rupiah(product.min_amount)} s.d. ${rupiah(product.max_amount)}` : `Di luar batas produk. Dihitung dengan ${rupiah(principal)}.`}
            </span>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold text-cream">Tenor</span>
            <select value={tenor} onChange={(e) => setTenor(Number(e.target.value))} className={inputClass}>
              {tenors.map((t) => <option key={t} value={t}>{t} bulan</option>)}
            </select>
          </label>
        </div>
      </div>
      <div className="self-start rounded-xl bg-surface p-6 text-ink sm:p-8">
        <p className="text-sm text-ink-muted">Cicilan per bulan</p>
        <p className="mt-1 font-display text-4xl font-bold tabular-nums sm:text-5xl">{rupiah(result.payment)}</p>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-5 text-sm tabular-nums">
          <div><dt className="text-ink-muted">Total bunga</dt><dd className="mt-1 font-bold">{rupiah(result.totalInterest)}</dd></div>
          <div><dt className="text-ink-muted">Total dibayar</dt><dd className="mt-1 font-bold">{rupiah(principal + result.totalInterest)}</dd></div>
        </dl>
        <p className="mt-5 text-sm font-bold">3 bulan pertama</p>
        <table className="mt-2 w-full text-sm tabular-nums">
          <thead className="text-left text-ink-muted">
            <tr><th className="py-2 font-normal">Bulan</th><th className="py-2 text-right font-normal">Pokok</th><th className="py-2 text-right font-normal">Bunga</th><th className="hidden py-2 text-right font-normal sm:table-cell">Sisa pokok</th></tr>
          </thead>
          <tbody>
            {result.rows.slice(0, 3).map((r) => (
              <tr key={r.number} className="border-t border-line">
                <td className="py-2">{r.number}</td><td className="py-2 text-right">{rupiah(r.principal)}</td>
                <td className="py-2 text-right">{rupiah(r.interest)}</td><td className="hidden py-2 text-right sm:table-cell">{rupiah(r.remaining_balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/daftar" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-shu px-5 font-bold text-surface hover:bg-shu-deep">
          Daftarkan usaha untuk mengajukan
        </Link>
      </div>
    </div>
  )
}

export default function Landing() {
  const { user } = useAuth()
  const { data: products } = useApi('/loan-products')

  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasi utama">
            <button onClick={() => scrollTo('simulasi')} className="hover:text-shu-deep">Simulasi</button>
            <button onClick={() => scrollTo('alur')} className="hover:text-shu-deep">Alur</button>
            <button onClick={() => scrollTo('syarat')} className="hover:text-shu-deep">Syarat &amp; Produk</button>
          </nav>
          <Link to={user ? homePath(user) : '/masuk'} className="inline-flex min-h-11 items-center rounded-lg bg-ink px-5 font-bold text-surface hover:bg-ink-soft">
            {user ? 'Buka aplikasi' : 'Masuk'}
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <p className="flex items-center gap-3 text-sm text-ink-muted"><span className="h-px w-8 bg-shu" />Pembiayaan modal untuk UMKM</p>
            <h1 className="mt-5 text-4xl leading-tight font-bold sm:text-5xl">
              Modal usaha dengan proses yang <span className="text-shu">bisa Anda pantau.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              Ajukan pembiayaan dari rumah, lihat setiap tahap pemeriksaan sampai dana cair, dan ketahui jadwal cicilan sejak sebelum mengajukan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/daftar" className="inline-flex min-h-12 items-center rounded-lg bg-shu px-6 font-bold text-surface shadow-[0_8px_20px_-8px_rgb(213_59_58/0.6)] hover:bg-shu-deep">
                Daftarkan Usaha
              </Link>
              <button onClick={() => scrollTo('simulasi')} className="inline-flex min-h-12 items-center rounded-lg border border-ink px-6 font-bold hover:bg-paper-deep">
                Hitung Cicilan
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface p-6 shadow-[0_24px_48px_-24px_rgb(53_35_28/0.35)] sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-ink-muted">Contoh tampilan status</p>
                <p className="mt-2 font-display text-xl font-bold">Modal Kerja Mikro</p>
                <p className="text-sm tabular-nums text-ink-muted">Rp25.000.000 · 12 bulan</p>
              </div>
              <StatusBadge status="verified" />
            </div>
            <div className="mt-5 border-t border-line pt-5"><Timeline steps={SAMPLE_STEPS} /></div>
          </div>
        </section>

        <section id="simulasi" className="kawung scroll-mt-4 text-cream">
          {products ? <Simulator products={products} /> : <div className="h-96" aria-busy="true" />}
        </section>

        <section id="alur" className="mx-auto grid max-w-6xl scroll-mt-4 grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:py-24">
          <div>
            <h2 className="text-3xl font-bold">Empat tahap, semuanya tercatat.</h2>
            <p className="mt-4 leading-relaxed text-ink-muted">Setiap keputusan disimpan bersama nama petugas dan catatannya. Anda melihat riwayat yang sama dengan yang dilihat petugas.</p>
          </div>
          <ol>
            {FLOW.map(([actor, title, text], i) => (
              <li key={title} className={`relative border-l-2 pl-6 ${i < FLOW.length - 1 ? 'border-line pb-8' : 'border-transparent'}`}>
                <span className={`absolute top-1.5 -left-[7px] size-3 rounded-full ${i < FLOW.length - 1 ? 'bg-ink' : 'bg-shu'}`} />
                <p className="text-sm font-bold text-shu-deep">{actor}</p>
                <h3 className="mt-1 text-xl font-bold">{title}</h3>
                <p className="mt-1 text-ink-muted">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="syarat" className="scroll-mt-4 border-t border-line bg-paper-deep">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-2xl font-bold">Yang perlu disiapkan</h2>
              <ul className="mt-5 grid gap-3">
                <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-shu" /><span><b>NIB</b> (Nomor Induk Berusaha) dari OSS.</span></li>
                <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-shu" /><span><b>Omzet bulanan</b> rata-rata. Plafon pinjaman dihitung dari angka ini.</span></li>
                <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-shu" /><span><b>Tujuan penggunaan dana</b>, misalnya belanja bahan baku atau membeli alat.</span></li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Produk pembiayaan</h2>
              <div className="relative mt-5 overflow-x-auto rounded-xl border border-line bg-surface">
                <table className="w-full min-w-[520px] text-sm tabular-nums">
                  <thead className="border-b border-line text-left text-ink-muted">
                    <tr><th className="px-4 py-3 font-normal">Produk</th><th className="px-4 py-3 font-normal">Bunga / tahun</th><th className="px-4 py-3 font-normal">Jumlah</th><th className="px-4 py-3 font-normal">Tenor</th></tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {products?.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-3 font-bold">{p.name}</td><td className="px-4 py-3">{percent(p.interest_rate)}</td>
                        <td className="px-4 py-3">{rupiah(p.min_amount)} s.d. {rupiah(p.max_amount)}</td><td className="px-4 py-3">{p.min_tenor} s.d. {p.max_tenor} bulan</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-ink-muted sm:px-6">
          <Logo className="text-lg text-ink" />
          <span>Project latihan LKS Web Technologies</span>
        </div>
      </footer>
    </>
  )
}
