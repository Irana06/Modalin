import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { STATUS, digits, formatDate } from '../lib/format'
import { Rule } from './motion'

const PATHS = {
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'm5 12 5 5 9-10',
  plus: 'M12 5v14M5 12h14',
  search: 'm20 20-4.5-4.5M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0',
}

export function Icon({ name, className = 'size-4', strokeWidth = 1.5 }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}

export function Logo({ to = '/', tone = 'ink', className = 'text-[22px]' }) {
  return (
    <Link to={to} aria-label="Modalin, ke beranda"
      className={`inline-flex items-baseline gap-[0.12em] font-medium tracking-[-0.04em] hover:opacity-70 ${tone === 'ink' ? 'text-ink' : 'text-night-text'} ${className}`}>
      <span>Modal<span className={tone === 'ink' ? 'text-ai' : 'text-ai-light'}>in</span></span>
      <span className={`size-[0.2em] ${tone === 'ink' ? 'bg-ai' : 'bg-ai-light'}`} />
    </Link>
  )
}

export function Spinner({ className = 'size-4' }) {
  return <span className={`inline-block animate-spin rounded-full border-[1.5px] border-current border-r-transparent ${className}`} aria-hidden="true" />
}

const VARIANT = {
  primary: 'bg-ink text-paper hover:bg-ai',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-paper',
  ghost: 'text-ai hover:bg-ai-soft',
  danger: 'bg-beni text-paper hover:bg-ink',
  remove: 'text-ink-muted hover:bg-beni-soft hover:text-beni',
}
const SIZE = { md: 'h-12 px-6 text-[14px]', sm: 'h-10 px-4 text-[13px]' }

/**
 * Shared look for buttons and button-styled links. The arrow nudges right on hover.
 * Content is centered unless the caller passes its own justify-* class.
 */
const buttonClass = (variant, size, className) =>
  `inline-flex shrink-0 items-center gap-3 font-medium tracking-[0.01em] whitespace-nowrap duration-500 ease-out-expo disabled:opacity-50 [&_svg]:transition-transform [&_svg]:duration-500 [&_svg]:ease-out-expo hover:[&_svg]:translate-x-1 ${className.includes('justify-') ? '' : 'justify-center'} ${VARIANT[variant]} ${SIZE[size]} ${className}`

export function Button({ variant = 'primary', size = 'md', loading = false, arrow = false, className = '', children, ...props }) {
  return (
    <button disabled={loading || props.disabled} className={buttonClass(variant, size, className)} {...props}>
      {loading && <Spinner />}
      {children}
      {arrow && !loading && <Icon name="arrow" />}
    </button>
  )
}

export function LinkButton({ variant = 'primary', size = 'md', arrow = true, className = '', children, ...props }) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
      {arrow && <Icon name="arrow" />}
    </Link>
  )
}

/** Small text link with the sweeping underline. */
export function TextLink({ className = '', ...props }) {
  return <Link className={`link-sweep font-medium text-ai hover:text-ai-deep ${className}`} {...props} />
}

export const inputClass =
  'h-12 w-full border border-line-strong bg-surface px-3.5 text-[15px] placeholder:text-ink-subtle hover:border-ink-muted focus:border-ink focus-visible:outline-offset-0 disabled:opacity-60 aria-[invalid=true]:border-beni'
export const selectClass = `${inputClass} select-chevron`

/** Mono uppercase label, the small caption style used above headings. */
export function Eyebrow({ className = 'text-ink-subtle', children }) {
  return <p className={`font-mono text-[11px] tracking-[0.14em] uppercase ${className}`}>{children}</p>
}

export function Field({ label, error, hint, children, className = '' }) {
  return (
    <label className={`grid content-start gap-2 ${className}`}>
      <span className="text-[13px] font-medium">{label}</span>
      {children}
      {hint && !error && <span className="text-[13px] leading-relaxed text-ink-subtle">{hint}</span>}
      {error && <span className="text-[13px] text-beni" role="alert">{error}</span>}
    </label>
  )
}

/** Text input that shows rupiah with thousand separators but reports a plain number. */
export function MoneyInput({ value, onChange, invalid, ...props }) {
  return (
    <div className="flex h-12 items-center border border-line-strong bg-surface px-3.5 transition-colors duration-400 hover:border-ink-muted has-focus:border-ink has-[[aria-invalid=true]]:border-beni">
      <span className="font-mono text-[13px] text-ink-subtle">Rp</span>
      <input
        inputMode="numeric"
        aria-invalid={invalid || undefined}
        value={value ? value.toLocaleString('id-ID') : ''}
        onChange={(e) => onChange(digits(e.target.value))}
        className="w-full bg-transparent px-2 py-3 text-[15px] tabular-nums outline-none"
        placeholder="0"
        {...props}
      />
    </div>
  )
}

export function StatusBadge({ status }) {
  const { label, className, active } = STATUS[status]
  return (
    <span className={`inline-flex h-7 shrink-0 items-center gap-2 px-2.5 text-[12px] font-medium whitespace-nowrap ${className}`}>
      {active && <span className="size-1.5 rounded-full bg-current" />}
      {label}
    </span>
  )
}

export function Card({ title, eyebrow, action, children, className = '' }) {
  return (
    <section className={`border border-line bg-surface ${className}`}>
      {title && (
        <div className="flex flex-wrap items-end justify-between gap-3 px-6 pt-6">
          <div>
            {eyebrow && <Eyebrow className="mb-1.5 text-ink-subtle">{eyebrow}</Eyebrow>}
            <h2 className="text-[18px] font-normal tracking-[-0.01em]">{title}</h2>
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

/** Page title in the editorial style: mono caption, large light headline, then a hairline that draws itself. */
export function PageHeader({ eyebrow, title, text, children }) {
  return (
    <header className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="grid gap-3">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="text-[32px] leading-[1.08] font-light tracking-[-0.035em] text-balance sm:text-[44px]">{title}</h1>
          {text && <p className="max-w-[560px] text-[15px] leading-[1.7] text-ink-muted">{text}</p>}
        </div>
        {children && <div className="flex flex-wrap gap-3">{children}</div>}
      </div>
      <Rule className="bg-ink" />
    </header>
  )
}

/** Underlined tabs; the active line grows from the left. */
export function Tabs({ label, items, value, onChange, className = '' }) {
  return (
    <div role="tablist" aria-label={label} className={`flex gap-6 overflow-x-auto overflow-y-hidden [scrollbar-width:none] sm:gap-8 ${className}`}>
      {items.map(({ key, label: text, count }) => {
        const selected = key === value
        return (
          <button key={key} type="button" role="tab" aria-selected={selected} onClick={() => onChange(key)}
            className={`relative flex h-12 shrink-0 items-center gap-2 text-[14px] whitespace-nowrap after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:bg-ink after:transition-transform after:duration-500 after:ease-out-expo ${selected ? 'text-ink after:scale-x-100' : 'text-ink-subtle after:scale-x-0 hover:text-ink'}`}>
            {text}
            {count !== undefined && <span className="font-mono text-[11px] text-ink-subtle tabular-nums">{String(count).padStart(2, '0')}</span>}
          </button>
        )
      })}
    </div>
  )
}

export function Skeleton({ rows = 5 }) {
  return (
    <div className="divide-y divide-line" aria-busy="true" aria-label="Memuat data">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-5">
          <div className="h-3.5 w-28 animate-pulse bg-paper-deep" />
          <div className="h-3.5 flex-1 animate-pulse bg-paper-deep" />
          <div className="h-7 w-24 animate-pulse bg-paper-deep" />
        </div>
      ))}
    </div>
  )
}

export function Message({ title, text, action }) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="text-[22px] font-light tracking-[-0.02em]">{title}</p>
      {text && <p className="mx-auto mt-2 max-w-md text-[15px] leading-[1.7] text-ink-muted">{text}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}

/** Loading, error and empty states for anything fetched with useApi. */
export function DataState({ loading, error, empty, emptyTitle, emptyText, emptyAction, onRetry, children }) {
  if (loading && empty === undefined) return <Skeleton />
  if (error) return <Message title="Data gagal dimuat" text={error.message} action={<Button variant="outline" onClick={onRetry}>Coba lagi</Button>} />
  if (empty) return <Message title={emptyTitle} text={emptyText} action={emptyAction} />
  return <div className={loading ? 'opacity-50 transition-opacity duration-500' : 'transition-opacity duration-500'}>{children}</div>
}

export function Pagination({ page, onPage }) {
  if (!page || page.total === 0) return null
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-4 text-[13px]">
      <p className="font-mono text-[12px] text-ink-subtle tabular-nums">{page.from}-{page.to} dari {page.total}</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page.current_page === 1} onClick={() => onPage(page.current_page - 1)}>Sebelumnya</Button>
        <Button variant="outline" size="sm" disabled={page.current_page === page.last_page} onClick={() => onPage(page.current_page + 1)}>Berikutnya</Button>
      </div>
    </div>
  )
}

/**
 * Opens and closes a native <dialog> from React state. Escape and backdrop clicks go through
 * onClose; letting the browser close the dialog itself would leave `open` true and the dialog
 * could not be reopened.
 */
function useDialog(open, onClose) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return {
    ref,
    onKeyDown: (e) => { if (e.key === 'Escape') { e.preventDefault(); onClose() } },
    onClick: (e) => e.target === ref.current && onClose(),
  }
}

function CloseButton({ onClick, className = '' }) {
  return (
    <button type="button" onClick={onClick} aria-label="Tutup" className={`-mr-2 grid size-10 shrink-0 place-items-center text-ink-subtle hover:bg-paper-deep hover:text-ink ${className}`}>
      <Icon name="close" className="size-5" />
    </button>
  )
}

export function Modal({ open, title, onClose, children }) {
  const dialog = useDialog(open, onClose)
  return (
    <dialog {...dialog} aria-labelledby="modal-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg border border-line bg-surface p-0 text-ink shadow-[0_32px_80px_-24px_rgb(22_22_22/0.45)] open:animate-dialog-in">
      {open && (
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-ink pb-4">
            <h2 id="modal-title" className="text-[22px] font-light tracking-[-0.02em]">{title}</h2>
            <CloseButton onClick={onClose} />
          </div>
          <div className="mt-5">{children}</div>
        </div>
      )}
    </dialog>
  )
}

export function ConfirmModal({ open, title, text, confirmLabel, danger, loading, onConfirm, onClose }) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-[15px] leading-[1.7] text-ink-muted">{text}</p>
      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Batal</Button>
        <Button variant={danger ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}

/** Panel that slides in from the right edge; used for the mobile menus. */
export function Sheet({ open, onClose, label, children }) {
  const dialog = useDialog(open, onClose)
  return (
    <dialog {...dialog} aria-label={label}
      className="m-0 ml-auto h-dvh max-h-none w-[min(320px,100%)] max-w-none border-l border-line bg-paper p-0 text-ink open:animate-sheet-in">
      {open && (
        <div className="flex min-h-full flex-col p-6">
          <CloseButton onClick={onClose} className="self-end" />
          {children}
        </div>
      )}
    </dialog>
  )
}

const MARKER = {
  done: <span className="grid size-6 place-items-center rounded-full bg-ink text-paper"><Icon name="check" className="size-3.5" strokeWidth={3} /></span>,
  current: <span className="grid size-6 place-items-center rounded-full border-2 border-ai"><span className="size-2.5 rounded-full bg-ai" /></span>,
  todo: <span className="block size-6 rounded-full border-2 border-line-strong" />,
  rejected: <span className="grid size-6 place-items-center rounded-full bg-beni text-paper"><Icon name="close" className="size-3.5" strokeWidth={3} /></span>,
}
const STATE_LABEL = { done: 'selesai', current: 'sedang diproses', todo: 'belum', rejected: 'ditolak' }

export function Timeline({ steps }) {
  return (
    <ol className="grid gap-5">
      {steps.map((step) => (
        <li key={step.title} className="grid grid-cols-[1.5rem_1fr] gap-x-4" aria-current={step.state === 'current' ? 'step' : undefined}>
          {MARKER[step.state]}
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className={`text-[15px] ${step.state === 'current' ? 'font-medium text-ai' : step.state === 'todo' ? 'text-ink-subtle' : 'font-medium'}`}>
                {step.title}<span className="sr-only">, {STATE_LABEL[step.state]}</span>
              </p>
              <p className="text-[13px] text-ink-subtle tabular-nums">{step.date ? formatDate(step.date) : step.state === 'current' ? 'Sedang diproses' : ''}</p>
            </div>
            {step.by && <p className="text-[13px] text-ink-subtle">{step.by}</p>}
            {step.note && (
              <p className="mt-2.5 bg-paper-deep px-3.5 py-3 text-[13px] leading-[1.6] text-ink-muted">
                <span className="font-medium text-ink-soft">Catatan</span><br />{step.note}
              </p>
            )}
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
      setItem({ ...e.detail, id: Date.now() })
      clearTimeout(timer)
      timer = setTimeout(() => setItem(null), 4000)
    }
    window.addEventListener('app:toast', show)
    return () => window.removeEventListener('app:toast', show)
  }, [])

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6">
      {item && (
        <p key={item.id} className={`flex animate-dialog-in items-center gap-3 px-5 py-4 text-[14px] shadow-[0_24px_48px_-16px_rgb(22_22_22/0.5)] ${item.type === 'error' ? 'bg-beni text-paper' : 'bg-ink text-paper'}`}>
          <span className={`size-1.5 shrink-0 rounded-full ${item.type === 'error' ? 'bg-paper' : 'bg-ai-light'}`} />
          {item.message}
        </p>
      )}
    </div>
  )
}
