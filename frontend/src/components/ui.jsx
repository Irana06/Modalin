import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { STATUS, digits, formatDate } from '../lib/format'

export function Logo({ to = '/', className = 'text-2xl' }) {
  return (
    <Link to={to} className={`font-display font-bold ${className}`}>
      Modal<span className="text-shu">in</span>
    </Link>
  )
}

export function Spinner({ className = 'size-4' }) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`} aria-hidden="true" />
}

const BUTTON = {
  primary: 'bg-shu text-surface hover:bg-shu-deep',
  dark: 'bg-ink text-surface hover:bg-ink-soft',
  outline: 'border border-ink hover:bg-paper-deep',
  ghost: 'text-shu-deep hover:bg-shu-soft',
}

export function Button({ variant = 'primary', loading = false, className = '', children, ...props }) {
  return (
    <button
      disabled={loading || props.disabled}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 font-bold transition-colors disabled:opacity-60 ${BUTTON[variant]} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}

export const inputClass =
  'min-h-12 w-full rounded-lg border border-line-strong bg-surface px-3 aria-[invalid=true]:border-shu-deep'

export function Field({ label, error, hint, children, className = '' }) {
  return (
    <label className={`grid content-start gap-2 ${className}`}>
      <span className="text-sm font-bold">{label}</span>
      {children}
      {hint && !error && <span className="text-sm text-ink-muted">{hint}</span>}
      {error && <span className="text-sm text-shu-deep" role="alert">{error}</span>}
    </label>
  )
}

/** Text input that shows rupiah with thousand separators but reports a plain number. */
export function MoneyInput({ value, onChange, invalid, ...props }) {
  return (
    <div className="flex min-h-12 items-center rounded-lg border border-line-strong bg-surface px-3 has-[[aria-invalid=true]]:border-shu-deep">
      <span className="text-ink-muted">Rp</span>
      <input
        inputMode="numeric"
        aria-invalid={invalid || undefined}
        value={value ? value.toLocaleString('id-ID') : ''}
        onChange={(e) => onChange(digits(e.target.value))}
        className="w-full bg-transparent px-2 py-3 tabular-nums outline-none"
        placeholder="0"
        {...props}
      />
    </div>
  )
}

export function StatusBadge({ status }) {
  const { label, className } = STATUS[status]
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold ${className}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

export function Card({ title, action, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-line bg-surface ${className}`}>
      {title && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 pt-5">
          <h2 className="text-lg font-bold">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function PageHeader({ title, text, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {text && <p className="mt-1 text-ink-muted">{text}</p>}
      </div>
      {children}
    </div>
  )
}

export function Skeleton({ rows = 5 }) {
  return (
    <div className="divide-y divide-line" aria-busy="true" aria-label="Memuat data">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="h-4 w-28 animate-pulse rounded bg-paper-deep" />
          <div className="h-4 flex-1 animate-pulse rounded bg-paper-deep" />
          <div className="h-6 w-24 animate-pulse rounded bg-paper-deep" />
        </div>
      ))}
    </div>
  )
}

export function Message({ title, text, action }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-display text-xl font-bold">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-md text-ink-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/** Loading, error and empty states for anything fetched with useApi. */
export function DataState({ loading, error, empty, emptyTitle, emptyText, emptyAction, onRetry, children }) {
  if (loading && empty === undefined) return <Skeleton />
  if (error) return <Message title="Data gagal dimuat" text={error.message} action={<Button variant="dark" onClick={onRetry}>Coba lagi</Button>} />
  if (empty) return <Message title={emptyTitle} text={emptyText} action={emptyAction} />
  return <div className={loading ? 'opacity-60 transition-opacity' : ''}>{children}</div>
}

export function Pagination({ page, onPage }) {
  if (!page || page.total === 0) return null
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3 text-sm">
      <p className="tabular-nums text-ink-muted">Menampilkan {page.from} s.d. {page.to} dari {page.total}</p>
      <div className="flex gap-2">
        <Button variant="outline" className="px-4" disabled={page.current_page === 1} onClick={() => onPage(page.current_page - 1)}>Sebelumnya</Button>
        <Button variant="outline" className="px-4" disabled={page.current_page === page.last_page} onClick={() => onPage(page.current_page + 1)}>Berikutnya</Button>
      </div>
    </div>
  )
}

export function Modal({ open, title, onClose, children }) {
  const ref = useRef(null)
  useEffect(() => {
    if (open) ref.current?.showModal()
    else ref.current?.close()
  }, [open])

  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="modal-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl bg-surface p-0 text-ink shadow-[0_24px_64px_-16px_rgb(53_35_28/0.5)]">
      {open && (
        <div className="p-6">
          <h2 id="modal-title" className="text-xl font-bold">{title}</h2>
          <div className="mt-3">{children}</div>
        </div>
      )}
    </dialog>
  )
}

export function ConfirmModal({ open, title, text, confirmLabel, danger, loading, onConfirm, onClose }) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-ink-muted">{text}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Batal</Button>
        <Button variant={danger ? 'dark' : 'primary'} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}

const ICON = {
  done: <span className="grid size-6 place-items-center rounded-full bg-ink text-surface"><svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg></span>,
  current: <span className="grid size-6 place-items-center rounded-full border-2 border-shu"><span className="size-2.5 rounded-full bg-shu" /></span>,
  todo: <span className="block size-6 rounded-full border-2 border-line-strong" />,
  rejected: <span className="grid size-6 place-items-center rounded-full bg-ink-muted text-surface"><svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg></span>,
}
const STATE_LABEL = { done: 'selesai', current: 'sedang diproses', todo: 'belum', rejected: 'ditolak' }

export function Timeline({ steps }) {
  return (
    <ol className="grid gap-4">
      {steps.map((step) => (
        <li key={step.title} className="grid grid-cols-[1.5rem_1fr] gap-x-4">
          {ICON[step.state]}
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className={step.state === 'current' ? 'font-bold text-shu-deep' : step.state === 'todo' ? 'text-ink-muted' : 'font-bold'}>
                {step.title}<span className="sr-only">, {STATE_LABEL[step.state]}</span>
              </p>
              <p className="text-sm tabular-nums text-ink-muted">{step.date ? formatDate(step.date) : step.state === 'current' ? 'Sedang diproses' : ''}</p>
            </div>
            {step.by && <p className="text-sm text-ink-muted">{step.by}</p>}
            {step.note && <p className="mt-2 rounded-lg bg-paper-deep px-3 py-2 text-sm">{step.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function ToastHost() {
  const [item, setItem] = useState(null)
  useEffect(() => {
    let timer
    const show = (e) => {
      setItem(e.detail)
      clearTimeout(timer)
      timer = setTimeout(() => setItem(null), 4000)
    }
    window.addEventListener('app:toast', show)
    return () => window.removeEventListener('app:toast', show)
  }, [])

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6">
      {item && (
        <p className={`animate-page-in rounded-lg px-5 py-3 font-medium shadow-lg ${item.type === 'error' ? 'bg-shu-deep text-surface' : 'bg-ink text-surface'}`}>
          {item.message}
        </p>
      )}
    </div>
  )
}
