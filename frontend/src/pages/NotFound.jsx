import { FadeIn, MaskLine } from '../components/motion'
import { Eyebrow, LinkButton, Logo } from '../components/ui'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col justify-between overflow-hidden px-5 py-8 sm:px-10 lg:px-14">
      <Logo />
      <div className="py-16">
        <Eyebrow>404 / Tidak ditemukan</Eyebrow>
        <h1 className="mt-4 text-[44px] leading-[1.02] font-light tracking-[-0.045em] sm:text-[76px]">
          <MaskLine>Halaman ini</MaskLine>
          <MaskLine delay={120}>tidak ada<span className="text-ai">.</span></MaskLine>
        </h1>
        <FadeIn delay={400}>
          <p className="mt-6 max-w-[420px] text-[15px] leading-[1.7] text-ink-muted">Alamat yang Anda buka tidak ada atau sudah dipindahkan.</p>
          <LinkButton to="/" className="mt-8">Kembali ke beranda</LinkButton>
        </FadeIn>
      </div>
      <FadeIn as="p" delay={700} lang="ja" aria-hidden="true" className="tategaki absolute top-8 right-6 text-[15px] text-ink-subtle sm:right-10">迷子</FadeIn>
      <span />
    </main>
  )
}
