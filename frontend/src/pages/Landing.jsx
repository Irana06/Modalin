import { useEffect, useState } from 'react'
import { useApi } from '../lib/useApi'
import { MAX_REVENUE_MULTIPLIER, percent, rupiah, schedule, tenorsFor } from '../lib/format'
import { FadeIn, MaskLine, Reveal, Rule } from '../components/motion'
import { Container, SectionHeading, SiteFooter, SiteHeader } from '../components/site'
import { Button, Eyebrow, Icon, LinkButton, MoneyInput, StatusBadge, Tabs, Timeline } from '../components/ui'

const SAMPLE_STEPS = [
  { title: 'Diajukan', date: '2026-10-03', by: 'Pemilik usaha', state: 'done' },
  { title: 'Verifikasi data usaha', date: '2026-10-06', by: 'Verifikator', note: 'NIB dan omzet sesuai dokumen.', state: 'done' },
  { title: 'Persetujuan manajer', state: 'current' },
  { title: 'Pencairan dana', state: 'todo' },
]

// One kanji pair per stage: 申請 apply, 審査 examine, 承認 approve, 融資 finance.
const FLOW = [
  ['申請', 'SHINSEI', 'Pelaku usaha', 'Isi profil usaha, pilih produk, jumlah, dan tenor. Jumlah di atas 3 kali omzet bulanan langsung ditolak sistem.'],
  ['審査', 'SHINSA', 'Verifikator', 'NIB, omzet, dan tujuan penggunaan dana dicocokkan. Penolakan selalu disertai alasan.'],
  ['承認', 'SHŌNIN', 'Manajer', 'Manajer hanya melihat pengajuan yang sudah lolos verifikasi, lalu memutuskan.'],
  ['融資', 'YŪSHI', 'Admin', 'Dana dicairkan dan jadwal cicilan lengkap terbit, lengkap dengan tanggal jatuh tempo.'],
]

const FAQ = [
  ['Apa saja yang perlu disiapkan?', 'NIB (Nomor Induk Berusaha) dari OSS, omzet bulanan rata-rata, dan tujuan penggunaan dana, misalnya belanja bahan baku atau membeli alat.'],
  ['Berapa jumlah maksimal yang bisa saya ajukan?', `Paling banyak ${MAX_REVENUE_MULTIPLIER} kali omzet bulanan, dan tetap di dalam batas produk yang dipilih. Omzet Rp10.000.000 per bulan berarti plafon Rp30.000.000.`],
  ['Bagaimana cicilan dihitung?', 'Memakai metode anuitas: jumlah bayar sama setiap bulan, sementara porsi bunga mengecil seiring sisa pokok berkurang. Simulasi di atas memakai rumus yang sama dengan jadwal resmi.'],
  ['Bisa mengajukan dua pembiayaan sekaligus?', 'Tidak. Pengajuan baru bisa dibuat setelah pengajuan sebelumnya dicairkan atau ditolak.'],
  ['Kalau pengajuan ditolak, apa yang terjadi?', 'Alasan penolakan dari petugas tampil di riwayat pengajuan Anda. Setelah itu Anda bisa mengajukan lagi dengan data yang diperbaiki.'],
]

const scrollToId = (id) => document.getElementById(id).scrollIntoView({ behavior: 'smooth' })

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <FadeIn as="p" delay={900} lang="ja" aria-hidden="true" className="tategaki absolute top-16 left-5 hidden text-[13px] text-ink-subtle xl:block 2xl:left-10">
        資金をつなぐ
      </FadeIn>
      <Container className="flex min-h-[min(calc(100svh-4rem),760px)] flex-col justify-between gap-12 pt-12 pb-10 sm:min-h-[min(calc(100svh-5rem),840px)] sm:pt-16 lg:gap-16 lg:pt-20">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
          <h1 className="text-[44px] leading-[1.02] font-light tracking-[-0.045em] sm:text-[72px] lg:col-span-7 lg:text-[76px] xl:text-[92px]">
            <MaskLine>Modal usaha</MaskLine>
            <MaskLine delay={120}>yang prosesnya</MaskLine>
            <MaskLine delay={240}>bisa dipantau<span className="text-ai">.</span></MaskLine>
          </h1>
          <FadeIn delay={500} className="lg:col-span-5">
            <SampleCard />
          </FadeIn>
        </div>

        <div className="flex flex-col gap-6">
          <Rule delay={600} className="bg-ink" />
          <FadeIn delay={800} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
            <p className="max-w-[440px] text-[15px] leading-[1.75] text-ink-muted sm:text-base lg:col-span-5">
              Ajukan pembiayaan dari rumah, lihat setiap tahap pemeriksaan sampai dana cair, dan ketahui jadwal cicilan sejak sebelum mengajukan.
            </p>
            <dl className="flex flex-col gap-3 text-[13px] lg:col-span-3">
              <div className="flex gap-4"><dt className="w-16 shrink-0 text-ink-subtle">Untuk</dt><dd>Usaha mikro dan kecil</dd></div>
              <div className="flex gap-4"><dt className="w-16 shrink-0 text-ink-subtle">Plafon</dt><dd>Sampai {MAX_REVENUE_MULTIPLIER}x omzet bulanan</dd></div>
            </dl>
            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row lg:col-span-4 lg:justify-end">
              <LinkButton to="/daftar" className="h-13 px-7">Daftarkan usaha</LinkButton>
              <Button variant="outline" onClick={() => scrollToId('simulasi')} className="h-13 px-7">Hitung cicilan</Button>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}

function SampleCard() {
  return (
    <article className="flex flex-col gap-6 border border-line bg-surface p-5 sm:p-8">
      <header className="flex flex-wrap-reverse items-start justify-between gap-4">
        <div className="grid min-w-[13rem] flex-1 gap-1.5">
          <Eyebrow>Contoh tampilan</Eyebrow>
          <p className="font-mono text-[13px] tracking-[0.06em] text-ai">MDL-2026-0001</p>
          <h3 className="text-[20px] tracking-[-0.01em] sm:text-[22px]">Modal Kerja Mikro</h3>
          <p className="text-[14px] text-ink-subtle tabular-nums">Rp25.000.000 · 12 bulan</p>
        </div>
        <StatusBadge status="verified" />
      </header>
      <div className="border-t border-line pt-6"><Timeline steps={SAMPLE_STEPS} /></div>
    </article>
  )
}

function Flow() {
  return (
    <section id="alur" className="scroll-mt-16 bg-night py-20 text-night-text sm:scroll-mt-20 sm:py-28 lg:py-40">
      <Container className="flex flex-col gap-14 sm:gap-20">
        <SectionHeading index={1} label="Alur" ja="流れ" tone="dark" title="Empat tahap, semuanya tercatat."
          description="Setiap keputusan disimpan bersama nama petugas dan catatannya. Anda melihat riwayat yang sama dengan yang dilihat petugas." />
        <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW.map(([kanji, romaji, actor, text], i) => (
            <li key={romaji} className="flex flex-col gap-7">
              <Rule delay={i * 120} className={i === 0 ? 'bg-ai-light' : 'bg-night-line'} />
              <Reveal delay={i * 120} className="flex gap-6 sm:gap-7">
                <span lang="ja" className="tategaki text-[30px] leading-none tracking-[0.2em] text-white sm:text-[36px]">{kanji}</span>
                <div className="flex flex-col gap-3">
                  <p className="font-mono text-[11px] tracking-[0.14em] text-night-muted">{String(i + 1).padStart(2, '0')} · {romaji}</p>
                  <h3 className="text-[20px] tracking-[-0.01em] sm:text-[22px]">{actor}</h3>
                  <p className="text-[14px] leading-[1.75] text-night-muted sm:text-[15px]">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

function Simulator({ products, productId, onProduct }) {
  const [amount, setAmount] = useState(25_000_000)
  const [tenor, setTenor] = useState(12)
  const product = products.find((p) => p.id === productId) ?? products[0]

  useEffect(() => {
    setAmount((a) => Math.min(Math.max(a, product.min_amount), product.max_amount))
    setTenor((t) => Math.min(Math.max(t, product.min_tenor), product.max_tenor))
  }, [product])

  const tenors = tenorsFor(product)
  const valid = amount >= product.min_amount && amount <= product.max_amount
  const principal = Math.min(Math.max(amount, product.min_amount), product.max_amount)
  const result = schedule(principal, product.interest_rate, tenor)

  return (
    <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
      <Reveal className="grid gap-8 lg:col-span-6">
        <Tabs label="Produk" value={product.id} onChange={onProduct} className="border-b border-line"
          items={products.map((p) => ({ key: p.id, label: p.name }))} />
        <p className="-mt-3 font-mono text-[12px] text-ink-subtle">Bunga {percent(product.interest_rate)} per tahun</p>

        <div className="grid gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <span id="amount-label" className="text-[13px] font-medium">Jumlah pinjaman</span>
            <span className={`text-[13px] tabular-nums ${valid ? 'text-ink-subtle' : 'text-beni'}`} aria-live="polite">
              {valid ? `${rupiah(product.min_amount)} s.d. ${rupiah(product.max_amount)}` : `Di luar batas. Dihitung dengan ${rupiah(principal)}.`}
            </span>
          </div>
          <MoneyInput value={amount} onChange={setAmount} invalid={!valid} aria-labelledby="amount-label" />
          <input type="range" min={product.min_amount} max={product.max_amount} step={1_000_000} value={principal}
            onChange={(e) => setAmount(Number(e.target.value))} className="range-ink w-full" aria-label="Geser jumlah pinjaman" />
        </div>

        <fieldset className="grid gap-3">
          <legend className="mb-3 text-[13px] font-medium">Tenor</legend>
          <div className="flex flex-wrap gap-2">
            {tenors.map((t) => (
              <button key={t} type="button" aria-pressed={tenor === t} onClick={() => setTenor(t)}
                className={`h-11 min-w-16 border px-4 text-[14px] tabular-nums ${tenor === t ? 'border-ink bg-ink text-paper' : 'border-line-strong text-ink-muted hover:border-ink hover:text-ink'}`}>
                {t} bln
              </button>
            ))}
          </div>
        </fieldset>
      </Reveal>

      <Reveal delay={150} className="border border-line bg-surface p-6 sm:p-8 lg:col-span-5 lg:col-start-8">
        <Eyebrow>Cicilan per bulan</Eyebrow>
        <p key={result.payment} className="mt-3 animate-page-in text-[44px] leading-none font-light tracking-[-0.03em] tabular-nums sm:text-[56px]">{rupiah(result.payment)}</p>
        <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-line py-5 text-[14px] tabular-nums">
          <div><dt className="text-ink-subtle">Total bunga</dt><dd className="mt-1 font-medium">{rupiah(result.totalInterest)}</dd></div>
          <div><dt className="text-ink-subtle">Total dibayar</dt><dd className="mt-1 font-medium">{rupiah(principal + result.totalInterest)}</dd></div>
        </dl>
        <Eyebrow className="mt-6 text-ink-subtle">3 bulan pertama</Eyebrow>
        <table className="mt-2 w-full text-[13px] tabular-nums">
          <thead className="text-left text-ink-subtle">
            <tr><th className="py-2 font-normal">Bulan</th><th className="py-2 text-right font-normal">Pokok</th><th className="py-2 text-right font-normal">Bunga</th><th className="hidden py-2 text-right font-normal sm:table-cell">Sisa pokok</th></tr>
          </thead>
          <tbody>
            {result.rows.slice(0, 3).map((r) => (
              <tr key={r.number} className="border-t border-line">
                <td className="py-2.5 font-mono text-[12px]">{String(r.number).padStart(2, '0')}</td><td className="py-2.5 text-right">{rupiah(r.principal)}</td>
                <td className="py-2.5 text-right">{rupiah(r.interest)}</td><td className="hidden py-2.5 text-right sm:table-cell">{rupiah(r.remaining_balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <LinkButton to="/daftar" className="mt-8 w-full justify-between">Daftarkan usaha untuk mengajukan</LinkButton>
      </Reveal>
    </div>
  )
}

function Products({ products, onPick }) {
  return (
    <ul className="grid border-t border-ink lg:grid-cols-3">
      {products.map((p, i) => (
        <li key={p.id} className="border-b border-line lg:border-b-0 lg:border-l lg:first:border-l-0 lg:[&:first-child>div]:pl-0">
          <Reveal delay={i * 100} className="flex h-full flex-col gap-8 py-10 sm:py-12 lg:px-10 lg:py-14">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-[26px] leading-tight font-light tracking-[-0.03em] sm:text-[30px]">{p.name}</h3>
              <span className="font-mono text-[12px] text-ink-subtle">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="grid gap-2.5">
              <Eyebrow>Bunga per tahun</Eyebrow>
              <p className="text-[40px] leading-none font-light tracking-[-0.03em] tabular-nums">{percent(p.interest_rate)}</p>
            </div>
            <ul className="flex flex-col gap-3 text-[15px] leading-[1.6] tabular-nums">
              <li className="flex gap-3.5"><span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-ink-subtle" />{rupiah(p.min_amount)} s.d. {rupiah(p.max_amount)}</li>
              <li className="flex gap-3.5"><span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-ink-subtle" />Tenor {p.min_tenor} s.d. {p.max_tenor} bulan</li>
              <li className="flex gap-3.5"><span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-ink-subtle" />Cicilan tetap setiap bulan</li>
            </ul>
            <Button variant="outline" arrow onClick={() => onPick(p.id)} className="mt-auto w-full justify-between sm:w-auto sm:self-start">
              Hitung cicilan produk ini
            </Button>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}

function Faq() {
  return (
    <div className="border-t border-ink lg:col-span-7">
      {FAQ.map(([question, answer], i) => (
        <details key={question} open={i === 0} className="group border-b border-line">
          <summary className="flex min-h-16 list-none items-center justify-between gap-6 py-6 hover:text-ai sm:py-8 [&::-webkit-details-marker]:hidden">
            <h3 className="text-[17px] leading-[1.4] tracking-[-0.01em] sm:text-[21px]">{question}</h3>
            <Icon name="plus" className="size-5 shrink-0 transition-transform duration-500 ease-out-expo group-open:rotate-45" />
          </summary>
          <p className="-mt-2 max-w-[640px] pb-7 text-[15px] leading-[1.8] text-ink-muted sm:pb-9 sm:text-base">{answer}</p>
        </details>
      ))}
    </div>
  )
}

export default function Landing() {
  const { data: products } = useApi('/loan-products')
  const [productId, setProductId] = useState('')

  const pick = (id) => {
    setProductId(id)
    scrollToId('simulasi')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Flow />

        <section id="simulasi" className="scroll-mt-16 bg-paper-deep py-20 sm:scroll-mt-20 sm:py-28 lg:py-40">
          <Container className="flex flex-col gap-12 sm:gap-16">
            <SectionHeading index={2} label="Simulasi" ja="試算" title="Hitung cicilan sebelum mengajukan."
              description="Geser jumlah, pilih tenor, dan lihat cicilannya langsung. Angkanya sama dengan jadwal resmi yang terbit saat dana cair." />
            {products ? <Simulator products={products} productId={productId} onProduct={setProductId} /> : <div className="h-96" aria-busy="true" />}
          </Container>
        </section>

        <section id="produk" className="scroll-mt-16 py-20 sm:scroll-mt-20 sm:py-28 lg:py-40">
          <Container className="flex flex-col gap-12 sm:gap-16">
            <SectionHeading index={3} label="Produk" ja="商品" title="Pilih sesuai skala usaha Anda."
              description="Mulai dari modal kerja mikro sampai investasi alat. Bunga tetap sejak pengajuan, walaupun produknya diubah kemudian." />
            {products && <Products products={products} onPick={pick} />}
          </Container>
        </section>

        <section id="syarat" className="scroll-mt-16 pb-20 sm:scroll-mt-20 sm:pb-28 lg:pb-40">
          <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <SectionHeading index={4} label="Syarat" ja="条件" title="Yang sering ditanyakan."
              description="Syarat dan batas pinjaman bisa Anda cek sendiri sebelum mengajukan."
              className="self-start lg:sticky lg:top-28 lg:col-span-5" />
            <Faq />
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
