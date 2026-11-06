import { useState } from 'react'
import { Link } from 'react-router'
import { homePath, useAuth } from '../lib/auth'
import { Reveal } from './motion'
import { Eyebrow, Icon, LinkButton, Logo, Sheet } from './ui'

const NAV = [
  ['Alur', '/#alur'],
  ['Simulasi', '/#simulasi'],
  ['Produk', '/#produk'],
  ['Syarat', '/#syarat'],
]

export function Container({ className = '', ...props }) {
  return <div className={`mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-14 ${className}`} {...props} />
}

export function SiteHeader() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const cta = user ? ['Buka aplikasi', homePath(user)] : ['Masuk', '/masuk']

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6 sm:h-20">
        <Logo />
        <nav aria-label="Navigasi utama" className="hidden items-center gap-9 text-[14px] lg:flex">
          {NAV.map(([label, href]) => <a key={href} href={href} className="link-sweep py-1 text-ink-muted hover:text-ink">{label}</a>)}
        </nav>
        <div className="hidden lg:block"><LinkButton to={cta[1]} size="sm">{cta[0]}</LinkButton></div>
        <button onClick={() => setOpen(true)} aria-label="Buka menu" aria-expanded={open} className="-mr-2 grid size-11 place-items-center hover:bg-paper-deep lg:hidden">
          <Icon name="menu" className="size-6" />
        </button>
      </Container>

      <Sheet open={open} onClose={() => setOpen(false)} label="Menu">
        <nav aria-label="Navigasi utama" className="mt-6 flex flex-col">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="border-b border-line py-4 text-[22px] font-light tracking-[-0.02em] text-ink-muted hover:text-ink">{label}</a>
          ))}
        </nav>
        <LinkButton to={cta[1]} className="mt-8 w-full justify-between">{cta[0]}</LinkButton>
      </Sheet>
    </header>
  )
}

/**
 * Section title in the editorial style: number and a vertical Japanese word in a narrow
 * margin column, then a large light headline.
 */
export function SectionHeading({ index, label, ja, title, description, tone = 'light', className = '' }) {
  const dark = tone === 'dark'
  const number = String(index).padStart(2, '0')

  return (
    <div className={`flex gap-8 lg:gap-12 ${className}`}>
      <div aria-hidden="true" className={`hidden shrink-0 flex-col items-center gap-4 pt-2 sm:flex ${dark ? 'text-night-muted' : 'text-ink-subtle'}`}>
        <span className="font-mono text-[11px]">{number}</span>
        <span className={`h-10 w-px ${dark ? 'bg-night-line' : 'bg-line-strong'}`} />
        <span lang="ja" className="tategaki text-[15px]">{ja}</span>
      </div>
      <Reveal className="flex flex-col gap-5 sm:gap-7">
        <Eyebrow className={`sm:hidden ${dark ? 'text-night-muted' : 'text-ink-subtle'}`}>{number} / {label}</Eyebrow>
        <h2 className="max-w-[820px] text-[34px] leading-[1.08] font-light tracking-[-0.035em] text-balance sm:text-[48px] lg:text-[60px]">{title}</h2>
        {description && <p className={`max-w-[540px] text-[15px] leading-[1.75] text-pretty sm:text-[16px] ${dark ? 'text-night-muted' : 'text-ink-muted'}`}>{description}</p>}
      </Reveal>
    </div>
  )
}

function FooterColumn({ title, children }) {
  return (
    <div className="flex flex-col gap-3.5 text-[14px] text-night-text/90 [&_a]:w-fit [&_a:hover]:text-white">
      <Eyebrow className="text-night-muted">{title}</Eyebrow>
      {children}
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-night text-night-text">
      <Container className="flex flex-col gap-12 pt-14 pb-10 sm:gap-16 sm:pt-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))] md:gap-12">
          <div className="flex flex-col items-start gap-5">
            <Logo tone="night" className="text-[26px]" />
            <p className="max-w-[320px] text-[15px] leading-[1.7] text-night-muted">
              Pengajuan pembiayaan modal untuk UMKM, dari pengajuan sampai jadwal cicilan, dalam satu tempat.
            </p>
          </div>
          <FooterColumn title="Informasi">
            {NAV.map(([label, href]) => <a key={href} href={href} className="link-sweep">{label}</a>)}
          </FooterColumn>
          <FooterColumn title="Akun">
            <Link to="/masuk" className="link-sweep">Masuk</Link>
            <Link to="/daftar" className="link-sweep">Daftarkan usaha</Link>
          </FooterColumn>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-night-line pt-6 text-[13px] text-night-muted">
          <p>© {new Date().getFullYear()} Modalin · Project latihan LKS Web Technologies</p>
          <p lang="ja" className="font-mincho tracking-[0.3em]">小さな商いに、確かな一歩。</p>
        </div>
      </Container>
    </footer>
  )
}
