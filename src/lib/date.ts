export const PROGRAM_START = '2026-11-26'
export const EVENT_DATE = '2027-01-20'
export const PROGRAM_DAYS = 56

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0)
}

export function toISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayISO(): string {
  return toISO(new Date())
}

export function addDays(iso: string, days: number): string {
  const d = parseISO(iso)
  d.setDate(d.getDate() + days)
  return toISO(d)
}

export function diffDays(fromISO: string, toISOStr: string): number {
  const a = parseISO(fromISO).getTime()
  const b = parseISO(toISOStr).getTime()
  return Math.round((b - a) / 86400000)
}

export function currentDayNumber(today = todayISO()): number {
  const raw = diffDays(PROGRAM_START, today) + 1
  return Math.max(1, Math.min(PROGRAM_DAYS, raw))
}

export function currentWeekNumber(today = todayISO()): number {
  return Math.max(1, Math.min(8, Math.ceil(currentDayNumber(today) / 7)))
}

export function daysUntilEvent(today = todayISO()): number {
  return diffDays(today, EVENT_DATE)
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }): string {
  if (!iso) return ''
  return parseISO(iso).toLocaleDateString('en-IN', opts)
}

export function formatLongDate(iso: string): string {
  return formatDate(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function isToday(iso: string): boolean {
  return iso === todayISO()
}

export function relativeLabel(iso: string): string {
  const delta = diffDays(todayISO(), iso)
  if (delta === 0) return 'Today'
  if (delta === 1) return 'Tomorrow'
  if (delta === -1) return 'Yesterday'
  if (delta > 1) return `In ${delta} days`
  return `${Math.abs(delta)} days ago`
}
