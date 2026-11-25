import React, { useEffect, useId } from 'react'
import { Icon, type IconName } from './Icon'

export type Tone = 'indigo' | 'green' | 'amber' | 'rose' | 'sky' | 'violet' | 'teal' | 'slate'

const toneStyles: Record<Tone, { bg: string; color: string }> = {
  indigo: { bg: '#eef0ff', color: '#4338ca' },
  green: { bg: '#e7f8f2', color: '#047857' },
  amber: { bg: '#fef5e4', color: '#b45309' },
  rose: { bg: '#fdeeee', color: '#b91c1c' },
  sky: { bg: '#e8f6fe', color: '#0369a1' },
  violet: { bg: '#f3eeff', color: '#6d28d9' },
  teal: { bg: '#e5faf6', color: '#0f766e' },
  slate: { bg: '#eef1f7', color: '#475569' },
}

export function Ring({
  value,
  size = 132,
  stroke = 11,
  label = 'complete',
  sub,
}: {
  value: number
  size?: number
  stroke?: number
  label?: string
  sub?: string
}) {
  const id = useId().replace(/:/g, '')
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  const offset = c - (pct / 100) * c
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg className="ring" width={size} height={size}>
        <defs>
          <linearGradient id={`ringGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="60%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        <circle className="ring-bg" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#ringGrad-${id})`}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="ring-fill"
        />
      </svg>
      <div className="ring-center">
        <strong>{Math.round(pct)}%</strong>
        <span>{label}</span>
        {sub ? <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--muted-2)', marginTop: 2 }}>{sub}</span> : null}
      </div>
    </div>
  )
}

export function Bar({
  value,
  tone = 'indigo',
  slim = false,
}: {
  value: number
  tone?: 'indigo' | 'green' | 'amber' | 'rose'
  slim?: boolean
}) {
  const cls = tone === 'indigo' ? 'bar-fill' : `bar-fill ${tone}`
  return (
    <div className={`bar${slim ? ' slim' : ''}`}>
      <div className={cls} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

export function Badge({
  tone = 'slate',
  children,
  dot = false,
}: {
  tone?: Tone
  children: React.ReactNode
  dot?: boolean
}) {
  const map: Record<Tone, string> = {
    indigo: 'b-indigo',
    green: 'b-green',
    amber: 'b-amber',
    rose: 'b-rose',
    sky: 'b-sky',
    violet: 'b-violet',
    teal: 'b-teal',
    slate: 'b-slate',
  }
  return (
    <span className={`badge ${map[tone]}`}>
      {dot ? <span className="bdot" /> : null}
      {children}
    </span>
  )
}

export function Stat({
  label,
  value,
  sub,
  icon,
  tone = 'indigo',
  foot,
}: {
  label: string
  value: React.ReactNode
  sub?: string
  icon: IconName
  tone?: Tone
  foot?: React.ReactNode
}) {
  const t = toneStyles[tone]
  return (
    <div className="stat">
      <div className="stat-top">
        <div className="stat-icon" style={{ background: t.bg, color: t.color }}>
          <Icon name={icon} size={17} />
        </div>
        {sub ? <span className="subtle">{sub}</span> : null}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {foot ? <div className="stat-foot">{foot}</div> : null}
    </div>
  )
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={wide ? { maxWidth: 760 } : undefined} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle ? <p className="subtle" style={{ marginTop: 3 }}>{subtitle}</p> : null}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" size={17} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-foot">{footer}</div> : null}
      </div>
    </div>
  )
}

export function Empty({
  icon = 'sparkles',
  title,
  text,
  action,
}: {
  icon?: IconName
  title: string
  text: string
  action?: React.ReactNode
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name={icon} size={21} />
      </div>
      <h4>{title}</h4>
      <p>{text}</p>
      {action}
    </div>
  )
}

export function Check({
  checked,
  onChange,
  label,
  className = '',
}: {
  checked: boolean
  onChange: () => void
  label: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`check-row ${className}`}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onChange()
        }
      }}
    >
      <span className={`check-box${checked ? ' checked' : ''}`}>
        <Icon name="check" size={12} strokeWidth={3} />
      </span>
      <span className={`check-label${checked ? ' done' : ''}`}>{label}</span>
    </div>
  )
}

export function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="stars" role="group" aria-label="Confidence rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star${n <= value ? ' on' : ''}`}
          onClick={() => onChange(n)}
          aria-label={`Confidence ${n} of 5`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { key: T; label: string; count?: number }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="tabs" role="tablist">
      {items.map((it) => (
        <button
          key={it.key}
          role="tab"
          aria-selected={value === it.key}
          className={`tab${value === it.key ? ' active' : ''}`}
          onClick={() => onChange(it.key)}
        >
          {it.label}
          {typeof it.count === 'number' ? ` (${it.count})` : ''}
        </button>
      ))}
    </div>
  )
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="search">
      <Icon name="search" size={15} />
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  )
}
