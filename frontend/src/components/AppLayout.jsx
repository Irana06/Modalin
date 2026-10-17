import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../lib/auth'
import { ROLE_LABEL } from '../lib/format'
import { Logo } from './ui'

const MENU = [
  { to: '/app', label: 'Beranda', roles: ['umkm'], end: true },
  { to: '/app/ajukan', label: 'Ajukan Pembiayaan', roles: ['umkm'] },
  { to: '/app/pengajuan', label: 'Pengajuan', roles: ['verifikator', 'manajer', 'admin'] },
  { to: '/app/produk', label: 'Produk Pembiayaan', roles: ['admin'] },
  { to: '/app/pengguna', label: 'Pengguna', roles: ['admin'] },
  { to: '/app/audit', label: 'Audit Log', roles: ['admin'] },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMenuOpen(false), [location.pathname])
  useEffect(() => {
    const close = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  const signOut = async () => {
    await logout()
    navigate('/masuk')
  }

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[248px_1fr]">
      <div className="flex items-center justify-between border-b border-line bg-paper-deep px-4 py-3 lg:hidden">
        <Logo to="/app" className="text-xl" />
        <button onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="sidebar"
          className="inline-flex min-h-11 items-center rounded-lg border border-line-strong px-4 text-sm font-bold hover:border-ink hover:bg-surface aria-expanded:bg-surface">
          Menu
        </button>
      </div>

      <aside id="sidebar" className={`${menuOpen ? 'flex animate-page-in lg:animate-none' : 'hidden'} flex-col border-r border-line bg-paper-deep lg:sticky lg:top-0 lg:flex lg:h-screen`}>
        <div className="hidden px-6 py-5 lg:block"><Logo to="/app" /></div>
        <nav className="grid gap-1 px-3 py-3 lg:py-0" aria-label="Menu aplikasi">
          {MENU.filter((item) => item.roles.includes(user.role)).map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `flex min-h-11 items-center rounded-lg px-3 ${isActive
                ? 'bg-surface font-bold shadow-[inset_3px_0_0_var(--color-shu)]'
                : 'text-ink-muted hover:bg-line hover:text-ink'}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-line px-6 py-4">
          <p className="font-bold">{user.name}</p>
          <p className="text-sm text-ink-muted">{ROLE_LABEL[user.role]}</p>
          <button onClick={signOut} className="mt-2 inline-flex min-h-11 items-center text-sm font-bold text-shu-deep hover:underline">Keluar</button>
        </div>
      </aside>

      <main className="min-w-0">
        <div key={location.pathname} className="mx-auto max-w-6xl animate-page-in px-4 py-8 sm:px-6 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
