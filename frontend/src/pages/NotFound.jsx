import { Link } from 'react-router'
import { Logo } from '../components/ui'

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <Logo />
        <h1 className="mt-8 text-3xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-ink-muted">Alamat yang Anda buka tidak ada atau sudah dipindahkan.</p>
        <Link to="/" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-ink px-5 font-bold text-surface hover:bg-ink-soft">Kembali ke beranda</Link>
      </div>
    </main>
  )
}
