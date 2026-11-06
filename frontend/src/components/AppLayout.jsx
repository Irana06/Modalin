import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../lib/auth'
import { ROLE_LABEL } from '../lib/format'
import { Eyebrow, Icon, Logo, Sheet } from './ui'

const MENU = [
  { to: '/app', label: 'Beranda', roles: ['umkm'], end: true },
  { to: '/app/ajukan', label: 'Ajukan Pembiayaan', roles: ['umkm'] },
  { to: '/app/pengajuan', label: 'Pengajuan', roles: ['verifikator', 'manajer', 'admin'] },
  { to: '/app/produk', label: 'Produk Pembiayaan', roles: ['admin'] },
  { to: '/app/pengguna', label: 'Pengguna', roles: ['admin'] },
  { to: '/app/audit', label: 'Audit Log', roles: ['admin'] },
]

function Nav({ items, large = false }) {
  return (
    <nav aria-label="Menu aplikasi" className="grid">
      {items.map((item, i) => (
        <NavLink key={item.to} to={item.to} end={item.end}
          className={({ isActive }) => `group flex items-baseline gap-4 border-b border-line ${large
            ? `py-4 text-[22px] font-light tracking-[-0.02em] ${isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'}`
            : `ink-wash px-6 py-3.5 text-[14px] ${isActive ? 'bg-ink text-paper' : 'text-ink-muted'}`}`}>
          {({ isActive }) => (
            <>
              <span className={`font-mono text-[11px] ${isActive ? (large ? 'text-ai' : 'text-ai-light') : `text-ink-subtle ${large ? '' : '[@media(hover:hover)]:group-hover:text-night-muted'}`}`}>{String(i + 1).padStart(2, '0')}</span>
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const items = MENU.filter((item) => item.roles.includes(user.role))

  useEffect(() => setMenuOpen(false), [location.pathname])

  const signOut = async () => {
    await logout()
    navigate('/masuk')
  }

  const account = (
    <div className="grid gap-1">
      <Eyebrow>{ROLE_LABEL[user.role]}</Eyebrow>
      <p className="text-[15px]">{user.name}</p>
      <button onClick={signOut} className="link-sweep mt-2 justify-self-start text-[13px] font-medium text-ink-muted hover:text-beni">Keluar</button>
    </div>
  )

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[264px_1fr]">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-paper/85 px-5 backdrop-blur-md lg:hidden">
        <Logo to={items[0].to} />
        <button onClick={() => setMenuOpen(true)} aria-label="Buka menu" aria-expanded={menuOpen}
          className="-mr-2 grid size-11 place-items-center hover:bg-paper-deep">
          <Icon name="menu" className="size-6" />
        </button>
      </header>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu aplikasi">
        <div className="mt-6"><Nav items={items} large /></div>
        <div className="mt-auto pt-10">{account}</div>
      </Sheet>

      <aside className="hidden border-r border-line bg-paper-deep lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex h-20 items-center px-6"><Logo to={items[0].to} /></div>
        <Eyebrow className="px-6 pb-3 text-ink-subtle">Menu</Eyebrow>
        <div className="border-t border-line"><Nav items={items} /></div>
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-line px-6 py-6">
          {account}
          <span lang="ja" aria-hidden="true" className="tategaki text-[13px] text-line-strong">資金</span>
        </div>
      </aside>

      <main className="min-w-0">
        <div key={location.pathname} className="mx-auto max-w-6xl animate-page-in px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
