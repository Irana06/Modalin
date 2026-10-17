export const rupiah = (n) => 'Rp' + Math.round(Number(n) || 0).toLocaleString('id-ID')
export const digits = (value) => Number(String(value).replace(/\D/g, '')) || 0
export const percent = (n) => `${String(n).replace('.', ',')}%`

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
export const formatDateTime = (value) =>
  new Date(value).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

// Same annuity formula as Installment::schedule() in the API, so the simulator matches the real schedule.
export function schedule(amount, annualRate, months) {
  const r = annualRate / 12 / 100
  const payment = Math.round(r > 0 ? (amount * r) / (1 - (1 + r) ** -months) : amount / months)
  let balance = amount
  const rows = []
  for (let i = 1; i <= months; i++) {
    const interest = Math.round(balance * r)
    const principal = i === months ? balance : payment - interest
    balance -= principal
    rows.push({ number: i, principal, interest, amount: principal + interest, remaining_balance: balance })
  }
  return { payment, rows, totalInterest: rows.reduce((sum, row) => sum + row.interest, 0) }
}

const TENORS = [3, 6, 9, 12, 18, 24, 36, 48, 60]
export function tenorsFor(product) {
  const list = TENORS.filter((t) => t >= product.min_tenor && t <= product.max_tenor)
  return list.length ? list : [product.min_tenor]
}

export const MAX_REVENUE_MULTIPLIER = 3
export const ACTIVE_STATUSES = ['submitted', 'verified', 'approved']
export const SECTORS = ['Kuliner', 'Kerajinan', 'Fesyen', 'Jasa', 'Perdagangan', 'Pertanian']

export const STATUS = {
  submitted: { label: 'Menunggu verifikasi', className: 'bg-shu-soft text-shu-deep' },
  verified: { label: 'Menunggu persetujuan', className: 'bg-shu-soft text-shu-deep' },
  approved: { label: 'Siap dicairkan', className: 'bg-cream text-ink' },
  disbursed: { label: 'Dana cair', className: 'bg-daun-soft text-daun' },
  rejected: { label: 'Ditolak', className: 'bg-paper-deep text-ink-muted' },
}

export const ROLE_LABEL = { admin: 'Admin', umkm: 'Pelaku usaha', verifikator: 'Verifikator', manajer: 'Manajer' }

/** Which role decides at each status. Mirrors LoanStatus::reviewer() in the API. */
export const REVIEWER = { submitted: 'verifikator', verified: 'manajer', approved: 'admin' }

const STAGES = [
  ['verification', 'Verifikasi data usaha', 'submitted'],
  ['approval', 'Persetujuan manajer', 'verified'],
  ['disbursement', 'Pencairan dana', 'approved'],
]

/** Builds the timeline steps for one loan application from its reviews. */
export function loanSteps(loan) {
  const steps = [{ title: 'Diajukan', date: loan.created_at, by: loan.business?.user?.name, state: 'done' }]
  for (const [stage, title, waitingStatus] of STAGES) {
    const review = loan.reviews?.find((r) => r.stage === stage)
    if (review) {
      steps.push({
        title,
        date: review.created_at,
        by: `${review.reviewer.name}, ${ROLE_LABEL[review.reviewer.role]}`,
        note: review.note,
        state: review.decision === 'approved' ? 'done' : 'rejected',
      })
      if (review.decision === 'rejected') break
    } else {
      steps.push({ title, state: loan.status === waitingStatus ? 'current' : 'todo' })
    }
  }
  return steps
}
