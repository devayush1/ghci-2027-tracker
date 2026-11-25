import React, { useRef, useState } from 'react'
import type { NavKey } from '../types'
import { Icon, type IconName } from './Icon'
import { Modal } from './ui'
import { useStore } from '../store'
import { todayISO } from '../lib/date'

const navGroups: { label: string; items: { key: NavKey; label: string; icon: IconName }[] }[] = [
  {
    label: 'Command centre',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { key: 'roadmap', label: 'Eight-week plan', icon: 'roadmap' },
      { key: 'daily', label: 'Daily breakdown', icon: 'calendar' },
    ],
  },
  {
    label: 'Technical practice',
    items: [
      { key: 'dsa', label: 'DSA tracker', icon: 'code' },
      { key: 'interview', label: 'Interview prep', icon: 'target' },
      { key: 'portfolio', label: 'Portfolio project', icon: 'layers' },
    ],
  },
  {
    label: 'Career & GHCI',
    items: [
      { key: 'applications', label: 'Applications', icon: 'briefcase' },
      { key: 'networking', label: 'Networking CRM', icon: 'users' },
      { key: 'event', label: 'Event-day checklist', icon: 'ticket' },
      { key: 'notes', label: 'Notes & reflections', icon: 'notes' },
    ],
  },
]

export const pageTitles: Record<NavKey, string> = {
  dashboard: 'Dashboard',
  roadmap: 'Eight-week plan',
  daily: 'Daily breakdown',
  dsa: 'DSA tracker',
  interview: 'Interview prep',
  portfolio: 'Portfolio project',
  applications: 'Applications',
  networking: 'Networking CRM',
  event: 'Event-day checklist',
  notes: 'Notes & reflections',
}

export function Layout({
  active,
  onNavigate,
  children,
}: {
  active: NavKey
  onNavigate: (k: NavKey) => void
  children: React.ReactNode
}) {
  const { store, actions, metrics } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const go = (k: NavKey) => {
    onNavigate(k)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const badgeFor = (k: NavKey): number | undefined => {
    if (k === 'daily') return metrics.pendingDays
    if (k === 'applications' && metrics.applications > 0) return metrics.applications
    if (k === 'networking' && metrics.contactsTotal > 0) return metrics.contactsTotal
    if (k === 'notes' && metrics.notesCount > 0) return metrics.notesCount
    return undefined
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ghci-2027-tracker-${todayISO()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        actions.importStore(parsed)
        setSettingsOpen(false)
      } catch {
        alert('That file could not be read as a tracker export.')
      }
    }
    reader.readAsText(file)
  }

  const reset = () => {
    const ok = window.confirm(
      'Reset everything? This clears all progress, notes, applications and contacts from this browser. Export a backup first if you want to keep it.',
    )
    if (ok) {
      actions.resetAll()
      setSettingsOpen(false)
    }
  }

  return (
    <div className="app">
      {mobileOpen ? <div className="overlay" onClick={() => setMobileOpen(false)} /> : null}
      <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">G</div>
          <div className="brand-text">
            <strong>GHCI 2027</strong>
            <span>Career command centre</span>
          </div>
        </div>

        <nav className="nav">
          {navGroups.map((group) => (
            <React.Fragment key={group.label}>
              <div className="nav-section">{group.label}</div>
              {group.items.map((item) => (
                <button
                  key={item.key}
                  className={`nav-item${active === item.key ? ' active' : ''}`}
                  onClick={() => go(item.key)}
                  aria-current={active === item.key ? 'page' : undefined}
                >
                  <span className="nav-icon">
                    <Icon name={item.icon} size={17} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                  {badgeFor(item.key) !== undefined ? (
                    <span className="nav-badge">{badgeFor(item.key)}</span>
                  ) : null}
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="mini-progress">
            <div className="mini-progress-top">
              <span>Preparation</span>
              <strong>{metrics.overallPct}%</strong>
            </div>
            <div className="mini-bar">
              <span style={{ width: `${metrics.overallPct}%` }} />
            </div>
            <div className="mini-meta">
              <span>{metrics.completedDays}/{metrics.totalDays} days</span>
              <span>
                {metrics.daysToEvent >= 0
                  ? `${metrics.daysToEvent} days to GHCI`
                  : 'GHCI has passed'}
              </span>
            </div>
          </div>
          <div className="mini-progress">
            <div className="mini-progress-top">
              <span>Week {metrics.currentWeek} of 8</span>
              <strong>{metrics.weekly[metrics.currentWeek - 1]?.pct ?? 0}%</strong>
            </div>
            <div className="mini-bar">
              <span style={{ width: `${metrics.weekly[metrics.currentWeek - 1]?.pct ?? 0}%` }} />
            </div>
            <div className="mini-meta">
              <span>{store.profile.targetRole}</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-btn hamburger"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              <Icon name={mobileOpen ? 'close' : 'menu'} size={18} />
            </button>
            <div className="topbar-crumb">
              <span>GHCI 2027</span>
              <Icon name="chevronRight" size={12} />
              <strong>{pageTitles[active]}</strong>
            </div>
          </div>
          <div className="topbar-right">
            <span className="event-pill">
              <span className="dot" />
              <span className="ep-long">GHCI Day 1 · 20 Jan 2027</span>
              <strong>
                {metrics.daysToEvent > 0
                  ? `${metrics.daysToEvent}d`
                  : metrics.daysToEvent === 0
                    ? 'Today'
                    : 'Done'}
              </strong>
            </span>
            <button className="icon-btn" onClick={() => setSettingsOpen(true)} aria-label="Settings and data">
              <Icon name="settings" size={17} />
            </button>
          </div>
        </header>

        <main className="page">{children}</main>
      </div>

      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Profile & data"
        subtitle="Everything is saved locally in this browser. Export a backup before clearing site data."
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setSettingsOpen(false)}>
              Close
            </button>
            <button className="btn btn-primary" onClick={() => setSettingsOpen(false)}>
              Done
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="field">
            <label className="label">Name</label>
            <input
              className="input"
              value={store.profile.name}
              onChange={(e) => actions.setProfile({ name: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="label">Headline</label>
            <input
              className="input"
              value={store.profile.headline}
              onChange={(e) => actions.setProfile({ headline: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="label">Target role</label>
            <input
              className="input"
              value={store.profile.targetRole}
              onChange={(e) => actions.setProfile({ targetRole: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="label">Target compensation</label>
            <input
              className="input"
              value={store.profile.targetComp}
              onChange={(e) => actions.setProfile({ targetComp: e.target.value })}
            />
          </div>
        </div>

        <div className="divider" />
        <h4 className="h3" style={{ marginBottom: 4 }}>Data management</h4>
        <p className="subtle" style={{ marginBottom: 12 }}>
          Your tracker lives only in this browser. Export a JSON backup to move it to another device.
        </p>
        <div className="row wrap">
          <button className="btn btn-outline" onClick={exportData}>
            <Icon name="download" size={15} /> Export JSON
          </button>
          <button className="btn btn-outline" onClick={() => fileRef.current?.click()}>
            <Icon name="upload" size={15} /> Import JSON
          </button>
          <button className="btn btn-danger" onClick={reset}>
            <Icon name="reset" size={15} /> Reset all
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importData(f)
              e.target.value = ''
            }}
          />
        </div>
        <div className="divider" />
        <p className="subtle">
          GHCI is a career and networking opportunity — not a guaranteed interview or job offer. This tracker is a
          preparation tool, not a promise of outcomes.
        </p>
      </Modal>
    </div>
  )
}
