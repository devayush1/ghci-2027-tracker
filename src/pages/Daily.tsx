import React, { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store'
import { dailyPlan, weeks } from '../data/plan'
import type { DayPlan } from '../types'
import { Badge, Bar, SearchInput, Tabs } from '../components/ui'
import { Icon } from '../components/Icon'
import { formatDate, isToday } from '../lib/date'

type WeekFilter = number | 'all'
type StatusFilter = 'all' | 'pending' | 'done'

export function Daily({
  week,
  onWeekChange,
}: {
  week: WeekFilter
  onWeekChange: (w: WeekFilter) => void
}) {
  const { store, actions, metrics } = useStore()
  const [status, setStatus] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set([metrics.currentDay]))

  const weekMeta = typeof week === 'number' ? weeks[week - 1] : null

  const visibleDays = useMemo(() => {
    return dailyPlan.filter((d) => {
      if (week !== 'all' && d.week !== week) return false
      if (status === 'pending' && store.days[d.day]?.done) return false
      if (status === 'done' && !store.days[d.day]?.done) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        const hay = `${d.title} ${d.topic} ${d.tasks.join(' ')} ${d.deliverable}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [week, status, query, store.days])

  useEffect(() => {
    if (typeof week === 'number') {
      const firstPending = dailyPlan.find((d) => d.week === week && !store.days[d.day]?.done)
      setExpanded(new Set([firstPending?.day ?? dailyPlan.find((d) => d.week === week)?.day ?? 1]))
    } else {
      setExpanded(new Set([metrics.currentDay]))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week])

  const toggleExpand = (day: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }

  const expandAll = () => setExpanded(new Set(visibleDays.map((d) => d.day)))
  const collapseAll = () => setExpanded(new Set())

  const scoped = week === 'all' ? dailyPlan : dailyPlan.filter((d) => d.week === week)
  const scopedDone = scoped.filter((d) => store.days[d.day]?.done).length
  const scopedPct = scoped.length ? Math.round((scopedDone / scoped.length) * 100) : 0

  return (
    <div className="stack">
      <div className="page-intro">
        <div>
          <div className="eyebrow">56 daily plans · 120 minutes each</div>
          <h1 className="h1">Daily breakdown</h1>
          <p>
            Every day lists the exact learning activities and the expected deliverable from the plan. Tick a day when
            the deliverable is real — not when the time is spent. Unfinished days stay pending without breaking the
            schedule.
          </p>
        </div>
        <div className="row wrap">
          <Badge tone="indigo" dot>Day {metrics.currentDay} · {metrics.todayPlan.title}</Badge>
          <Badge tone="green">{metrics.completedDays}/56 complete</Badge>
        </div>
      </div>

      <div className="card" style={{ padding: '14px 18px' }}>
        <div className="row-between wrap" style={{ gap: 10 }}>
          <div className="row" style={{ gap: 8 }}>
            <div className="stat-icon" style={{ width: 28, height: 28, borderRadius: 8 }}>
              <Icon name="clock" size={14} />
            </div>
            <span className="small" style={{ fontWeight: 600 }}>Two-hour daily commitment</span>
          </div>
          <div className="row wrap" style={{ gap: 6 }}>
            <span className="pill primary">40 min technical learning</span>
            <span className="pill">35 min coding / DSA</span>
            <span className="pill">30 min practical implementation</span>
            <span className="pill">15 min career / revision</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row-between wrap" style={{ gap: 12 }}>
          <div className="tabs">
            <button className={`tab${week === 'all' ? ' active' : ''}`} onClick={() => onWeekChange('all')}>
              All 56 days
            </button>
            {weeks.map((w) => (
              <button
                key={w.week}
                className={`tab${week === w.week ? ' active' : ''}`}
                onClick={() => onWeekChange(w.week)}
              >
                W{w.week}
              </button>
            ))}
          </div>
          <div className="row wrap">
            <SearchInput value={query} onChange={setQuery} placeholder="Search days, activities, deliverables…" />
          </div>
        </div>

        <div className="row-between wrap mt-2" style={{ gap: 12 }}>
          <Tabs<StatusFilter>
            items={[
              { key: 'all', label: 'All', count: scoped.length },
              { key: 'pending', label: 'Pending', count: scoped.length - scopedDone },
              { key: 'done', label: 'Completed', count: scopedDone },
            ]}
            value={status}
            onChange={setStatus}
          />
          <div className="row wrap">
            <button className="btn btn-sm btn-ghost" onClick={expandAll}>Expand all</button>
            <button className="btn btn-sm btn-ghost" onClick={collapseAll}>Collapse all</button>
          </div>
        </div>

        {weekMeta ? (
          <div className="mt-3" style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
            <div className="row-between wrap" style={{ gap: 10 }}>
              <div>
                <div className="row" style={{ gap: 8 }}>
                  <span className="week-num" style={{ '--accent': weekMeta.accent } as React.CSSProperties}>Week {weekMeta.week}</span>
                  <span className="week-title" style={{ marginTop: 0 }}>{weekMeta.title}</span>
                  <span className="subtle">· {weekMeta.range}</span>
                </div>
                <p className="subtle" style={{ marginTop: 4, maxWidth: 780 }}>{weekMeta.objective}</p>
              </div>
              <div style={{ minWidth: 180 }}>
                <div className="row-between mb-1">
                  <span className="tiny subtle">{scopedDone}/{scoped.length} days</span>
                  <span className="tiny" style={{ fontWeight: 700 }}>{scopedPct}%</span>
                </div>
                <Bar value={scopedPct} tone={scopedPct === 100 ? 'green' : 'indigo'} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 row wrap" style={{ gap: 8, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
            <span className="subtle">Overall: {metrics.completedDays}/{metrics.totalDays} days complete</span>
            <div style={{ flex: 1, minWidth: 160 }}>
              <Bar value={metrics.overallPct} />
            </div>
            <span className="tiny" style={{ fontWeight: 700 }}>{metrics.overallPct}%</span>
          </div>
        )}
      </div>

      {visibleDays.length === 0 ? (
        <div className="empty">
          <div className="empty-icon"><Icon name="search" size={21} /></div>
          <h4>No days match this filter</h4>
          <p>Try a different week, clear the search, or switch back to all days.</p>
          <button className="btn btn-outline" onClick={() => { setQuery(''); setStatus('all'); onWeekChange('all') }}>
            Reset filters
          </button>
        </div>
      ) : (
        <div className="stack" style={{ gap: 10 }}>
          {visibleDays.map((d) => (
            <DayCard
              key={d.day}
              day={d}
              done={Boolean(store.days[d.day]?.done)}
              notes={store.days[d.day]?.notes ?? ''}
              completedAt={store.days[d.day]?.completedAt ?? ''}
              expanded={expanded.has(d.day)}
              onToggleExpand={() => toggleExpand(d.day)}
              onToggleDone={() => actions.toggleDay(d.day)}
              onNotes={(v) => actions.setDayNotes(d.day, v)}
              isTodayDay={isToday(d.date)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function DayCard({
  day,
  done,
  notes,
  completedAt,
  expanded,
  onToggleExpand,
  onToggleDone,
  onNotes,
  isTodayDay,
}: {
  day: DayPlan
  done: boolean
  notes: string
  completedAt: string
  expanded: boolean
  onToggleExpand: () => void
  onToggleDone: () => void
  onNotes: (v: string) => void
  isTodayDay: boolean
}) {
  return (
    <article className={`day-card${done ? ' done' : ''}${isTodayDay ? ' today' : ''}`}>
      <div className="day-head" onClick={onToggleExpand} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' ? onToggleExpand() : null)}>
        <div
          className={`check-box${done ? ' checked' : ''}`}
          style={{ marginTop: 11, flexShrink: 0 }}
          onClick={(e) => {
            e.stopPropagation()
            onToggleDone()
          }}
          role="checkbox"
          aria-checked={done}
          aria-label={`Mark day ${day.day} complete`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              onToggleDone()
            }
          }}
        >
          <Icon name="check" size={12} strokeWidth={3} />
        </div>
        <div className="day-num">
          <strong>{day.day}</strong>
          <span>day</span>
        </div>
        <div className="day-head-main">
          <div className="day-title">
            {day.title}
            {isTodayDay ? <Badge tone="indigo">Today</Badge> : null}
            {day.day % 7 === 0 && day.day !== 56 ? <Badge tone="violet">Weekly review</Badge> : null}
            {done ? <Badge tone="green" dot>Done</Badge> : null}
          </div>
          <div className="day-topic">
            {day.topic} · {formatDate(day.date, { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </div>
        <div className="day-head-right">
          <span className="pill">120 min</span>
          <span className={`day-chevron${expanded ? ' open' : ''}`}>
            <Icon name="chevronDown" size={17} />
          </span>
        </div>
      </div>

      {expanded ? (
        <div className="day-body">
          <div className="row wrap" style={{ gap: 6, marginTop: 13 }}>
            <span className="chip">40 min learning</span>
            <span className="chip">35 min coding / DSA</span>
            <span className="chip">30 min implementation</span>
            <span className="chip">15 min career / revision</span>
          </div>

          <div className="day-objectives">
            <h5>Learning &amp; practice activities</h5>
            <ul>
              {day.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <div className="day-deliverable">
            <Icon name="trophy" size={15} />
            <span><strong>Expected deliverable:</strong> {day.deliverable}</span>
          </div>

          <div className="day-notes">
            <label className="label" htmlFor={`notes-${day.day}`}>Personal notes</label>
            <textarea
              id={`notes-${day.day}`}
              className="textarea"
              placeholder="What clicked? What is still fuzzy? What will you redo tomorrow?"
              value={notes}
              onChange={(e) => onNotes(e.target.value)}
            />
          </div>

          <div className="day-foot">
            <span className="day-dsa">
              {done && completedAt ? (
                <>
                  <Icon name="check" size={13} /> Completed {formatDate(completedAt.slice(0, 10))}
                </>
              ) : (
                <>
                  <Icon name="calendar" size={13} /> {formatDate(day.date)}
                </>
              )}
            </span>
            <div className="row">
              <span className="pill primary">{day.week === 8 && day.day === 56 ? 'GHCI event day' : `Week ${day.week} · Day ${day.day}`}</span>
              <button className={`btn btn-sm ${done ? 'btn-outline' : 'btn-primary'}`} onClick={onToggleDone}>
                <Icon name={done ? 'refresh' : 'check'} size={13} />
                {done ? 'Mark pending' : 'Mark complete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  )
}
