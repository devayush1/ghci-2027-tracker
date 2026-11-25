import React from 'react'
import type { NavKey } from '../types'
import { useStore } from '../store'
import { weeks } from '../data/plan'
import { Badge, Bar } from '../components/ui'
import { Icon } from '../components/Icon'

export function Roadmap({
  navigate,
  openWeek,
}: {
  navigate: (k: NavKey) => void
  openWeek: (week: number) => void
}) {
  const { metrics } = useStore()

  return (
    <div className="stack">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Eight-week programme</div>
          <h1 className="h1">From positioning to GHCI Day 1</h1>
          <p>
            26 November 2026 → 20 January 2027. Each week has a clear objective, focused topics, real deliverables and
            seven actionable days. The plan is sequenced so every week compounds the previous one.
          </p>
        </div>
        <div className="row wrap">
          <Badge tone="indigo" dot>Week {metrics.currentWeek} of 8</Badge>
          <Badge tone="green">{metrics.completedDays}/56 days done</Badge>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Programme map</div>
            <div className="card-sub">Two hours a day: 40 min learning · 35 min coding · 30 min building · 15 min career</div>
          </div>
          <div className="legend">
            <span><i style={{ background: 'var(--primary)' }} /> Complete</span>
            <span><i style={{ background: 'var(--green)' }} /> Current</span>
            <span><i style={{ background: 'var(--surface-3)' }} /> Upcoming</span>
          </div>
        </div>
        <div className="row wrap" style={{ gap: 8 }}>
          {weeks.map((w) => {
            const stat = metrics.weekly[w.week - 1]
            const isCurrent = w.week === metrics.currentWeek
            const complete = stat.done === stat.total
            return (
              <button
                key={w.week}
                onClick={() => openWeek(w.week)}
                style={{
                  flex: 1,
                  minWidth: 112,
                  border: `1px solid ${isCurrent ? '#c7c9ff' : 'var(--line)'}`,
                  background: complete ? 'var(--green-soft)' : isCurrent ? 'var(--primary-soft)' : '#fff',
                  borderRadius: 13,
                  padding: '10px 11px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div className="row-between">
                  <span className="tiny" style={{ fontWeight: 800, color: isCurrent ? 'var(--primary-ink)' : complete ? 'var(--green-ink)' : 'var(--muted)' }}>
                    WEEK {w.week}
                  </span>
                  <span className="tiny" style={{ fontWeight: 700 }}>{stat.pct}%</span>
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 600, margin: '3px 0 7px', lineHeight: 1.3 }}>
                  {w.title.split('&')[0].trim()}
                </div>
                <Bar value={stat.pct} tone={complete ? 'green' : 'indigo'} slim />
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-2">
        {weeks.map((w) => {
          const stat = metrics.weekly[w.week - 1]
          const isCurrent = w.week === metrics.currentWeek
          const complete = stat.done === stat.total
          return (
            <article
              className="week-card"
              key={w.week}
              style={{ '--accent': w.accent } as React.CSSProperties}
            >
              <div className="week-head">
                <div>
                  <div className="week-num">Week {w.week}</div>
                  <div className="week-title">{w.title}</div>
                  <div className="week-range">{w.range}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {complete ? (
                    <Badge tone="green" dot>Complete</Badge>
                  ) : isCurrent ? (
                    <Badge tone="indigo" dot>Current</Badge>
                  ) : (
                    <Badge tone="slate">{stat.done}/{stat.total} days</Badge>
                  )}
                </div>
              </div>

              <p className="week-obj">{w.objective}</p>

              <div className="chip-list">
                {w.focus.map((f) => (
                  <span className="chip" key={f}>{f}</span>
                ))}
              </div>

              <div className="week-deliverables">
                <h5>Expected deliverables</h5>
                <ul>
                  {w.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="week-progress">
                <Bar value={stat.pct} tone={complete ? 'green' : 'indigo'} />
                <span className="tiny" style={{ fontWeight: 700, width: 54, textAlign: 'right' }}>
                  {stat.done}/{stat.total} days
                </span>
              </div>

              <div className="row mt-2" style={{ gap: 8 }}>
                <button className="btn btn-sm btn-outline" onClick={() => openWeek(w.week)}>
                  <Icon name="calendar" size={13} /> Open daily plans
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => navigate('daily')}>
                  All days
                </button>
              </div>
            </article>
          )
        })}
      </div>

      <div className="card" style={{ background: 'linear-gradient(120deg,#0b1220,#16203c)', color: '#fff' }}>
        <div className="row-between wrap" style={{ gap: 18 }}>
          <div className="row" style={{ gap: 14 }}>
            <div className="na-icon" style={{ background: 'linear-gradient(140deg,#14b8a6,#0ea5e9)' }}>
              <Icon name="sparkles" size={19} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 15 }}>
                Every seventh day is a review day
              </div>
              <div style={{ color: '#a9b8d4', fontSize: 12.5, maxWidth: 700, marginTop: 3 }}>
                Review days are built into the plan, not bolted on. If a task slips, leave it pending and keep the
                schedule moving — the tracker is designed for real life, not perfect streaks.
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('daily')}>
            Start with today <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
