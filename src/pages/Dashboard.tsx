import React from 'react'
import type { NavKey } from '../types'
import { useStore } from '../store'
import { dailyPlan, weeks } from '../data/plan'
import { formatDate, formatLongDate, todayISO } from '../lib/date'
import { Badge, Bar, Check, Ring, Stat } from '../components/ui'
import { Icon } from '../components/Icon'

export function Dashboard({ navigate }: { navigate: (k: NavKey) => void }) {
  const { store, actions, metrics } = useStore()
  const week = weeks[metrics.currentWeek - 1]
  const weekDays = dailyPlan.filter((d) => d.week === metrics.currentWeek)
  const next = metrics.nextTask
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const dsaPct = metrics.dsaPct
  const topicPct = metrics.topicsTotal ? Math.round((metrics.topicsCompleted / metrics.topicsTotal) * 100) : 0

  return (
    <div className="stack">
      <section className="hero">
        <div>
          <div className="eyebrow">GHCI 2027 · Career switch command centre</div>
          <h1>
            {greeting}, {store.profile.name || 'there'}.
            <br />
            Let&apos;s make this switch deliberate.
          </h1>
          <p>
            2.5 years of production experience at Zeliot Connected Services across React, Node, Go, Redis and
            cloud-connected IoT systems. Now targeting {store.profile.targetRole} at {store.profile.targetComp} with two
            focused hours a day from {formatDate('2026-11-26', { day: 'numeric', month: 'short' })} to GHCI Day 1.
          </p>
          <div className="hero-meta">
            <span className="hero-chip">
              <Icon name="calendar" size={13} /> {formatLongDate(todayISO())}
            </span>
            <span className="hero-chip">
              <Icon name="briefcase" size={13} /> SE2 @ Zeliot Connected Services
            </span>
            <span className="hero-chip">
              <Icon name="target" size={13} /> Week {metrics.currentWeek} of 8 · Day {metrics.currentDay} of 56
            </span>
            <span className="hero-chip">
              <Icon name="clock" size={13} /> 2 hours / day
            </span>
            <span className="hero-chip">
              <Icon name="mapPin" size={13} /> KTPO, Whitefield
            </span>
          </div>
        </div>
        <div className="hero-right">
          <div className="countdown">
            <strong>
              {metrics.daysToEvent > 0 ? metrics.daysToEvent : metrics.daysToEvent === 0 ? '0' : '✓'}
            </strong>
            <span>{metrics.daysToEvent > 0 ? 'days until GHCI 2027' : metrics.daysToEvent === 0 ? 'GHCI is today' : 'GHCI 2027 complete'}</span>
            <small>20 January 2027 · Day 1</small>
          </div>
        </div>
      </section>

      {next ? (
        <div className="next-action">
          <div className="na-left">
            <div className="na-icon">
              <Icon name="zap" size={19} />
            </div>
            <div>
              <div className="eyebrow" style={{ color: 'var(--primary-ink)' }}>Next important action</div>
              <div className="na-title">
                Day {next.day} · {next.title}
              </div>
              <div className="na-sub">
                {next.topic} · {formatDate(next.date)} · deliverable: {next.deliverable}
              </div>
            </div>
          </div>
          <div className="row wrap">
            <Badge tone="indigo">{next.week === 8 && next.day === 56 ? 'GHCI event day' : `Week ${next.week} · Day ${next.day}`}</Badge>
            <button className="btn btn-primary" onClick={() => navigate('daily')}>
              Open daily plan <Icon name="arrowRight" size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="next-action">
          <div className="na-left">
            <div className="na-icon" style={{ background: 'linear-gradient(140deg,#10b981,#14b8a6)' }}>
              <Icon name="trophy" size={19} />
            </div>
            <div>
              <div className="eyebrow" style={{ color: 'var(--green-ink)' }}>All 56 days complete</div>
              <div className="na-title">You have finished the preparation programme.</div>
              <div className="na-sub">Review your mock-question log and keep the GHCI follow-ups warm.</div>
            </div>
          </div>
          <button className="btn btn-outline" onClick={() => navigate('notes')}>
            Write a reflection <Icon name="arrowRight" size={14} />
          </button>
        </div>
      )}

      <section className="grid grid-4">
        <Stat
          label="Preparation tasks complete"
          value={<>{metrics.completedDays}<small>/ {metrics.totalDays}</small></>}
          icon="check"
          tone="green"
          sub={`${metrics.overallPct}% overall`}
          foot={<span className="trend-up">{metrics.pendingDays} pending · {metrics.totalDays - metrics.pendingDays} done</span>}
        />
        <Stat
          label="DSA problems solved"
          value={<>{metrics.dsaSolved}<small>/ {metrics.dsaTotal}</small></>}
          icon="code"
          tone="sky"
          sub={`${dsaPct}% of target list`}
          foot={<span>{metrics.dsaAttempted} attempted · {metrics.dsaRevision} need revision</span>}
        />
        <Stat
          label="Technical topics completed"
          value={<>{metrics.topicsCompleted}<small>/ {metrics.topicsTotal}</small></>}
          icon="target"
          tone="violet"
          sub={`${topicPct}% complete`}
          foot={<span>Avg confidence {metrics.avgConfidence}/5</span>}
        />
        <Stat
          label="Portfolio project"
          value={<>{metrics.portfolioPct}<small>%</small></>}
          icon="layers"
          tone="indigo"
          sub={`${metrics.portfolioTasksDone}/${metrics.portfolioTasksTotal} tasks`}
          foot={<span>DevAssist AI · deployable MVP</span>}
        />
        <Stat
          label="Job applications"
          value={metrics.applications}
          icon="briefcase"
          tone="amber"
          sub={metrics.applications ? `${metrics.interviewRate}% interview rate` : 'Log real applications only'}
          foot={<span>{metrics.interviews} interviews · {metrics.offers} offers</span>}
        />
        <Stat
          label="Networking conversations"
          value={metrics.conversations}
          icon="users"
          tone="teal"
          sub={`${metrics.contactsTotal} contacts tracked`}
          foot={<span>{metrics.researchTotal} companies researched</span>}
        />
        <Stat
          label="Days until GHCI 2027"
          value={metrics.daysToEvent > 0 ? metrics.daysToEvent : metrics.daysToEvent === 0 ? 'Today' : 'Done'}
          icon="ticket"
          tone="rose"
          sub="20 Jan 2027 · KTPO"
          foot={<span>Event checklist {metrics.eventPct}% ready</span>}
        />
        <Stat
          label="Mock questions to revisit"
          value={metrics.mockOpen}
          icon="alert"
          tone={metrics.mockOpen ? 'rose' : 'green'}
          sub={`${metrics.notesCount} reflections saved`}
          foot={<span>Log every stumble from mocks</span>}
        />
      </section>

      <section className="grid grid-2">
        <div className="card pad-lg">
          <div className="card-head">
            <div>
              <div className="card-title">Overall preparation</div>
              <div className="card-sub">56 daily plans · eight weeks · one clear outcome</div>
            </div>
            <Badge tone="indigo" dot>{week.title}</Badge>
          </div>
          <div className="row" style={{ gap: 26, alignItems: 'center', flexWrap: 'wrap' }}>
            <Ring value={metrics.overallPct} size={140} label="complete" />
            <div style={{ flex: 1, minWidth: 190 }}>
              <div className="kv">
                <span>Completed days</span>
                <strong>{metrics.completedDays}</strong>
              </div>
              <div className="kv">
                <span>Pending days</span>
                <strong>{metrics.pendingDays}</strong>
              </div>
              <div className="kv">
                <span>Current week</span>
                <strong>Week {metrics.currentWeek} · {week.range}</strong>
              </div>
              <div className="kv">
                <span>Current day</span>
                <strong>Day {metrics.currentDay}</strong>
              </div>
              <div className="mt-2">
                <div className="row-between mb-1">
                  <span className="subtle">Week {metrics.currentWeek} progress</span>
                  <span className="tiny" style={{ fontWeight: 700 }}>{metrics.weekly[metrics.currentWeek - 1]?.pct ?? 0}%</span>
                </div>
                <Bar value={metrics.weekly[metrics.currentWeek - 1]?.pct ?? 0} />
              </div>
            </div>
          </div>

          <div className="divider" />
          <div className="row-between mb-2">
            <span className="card-title" style={{ fontSize: 13 }}>Weekly completion</span>
            <span className="subtle">Days done per week</span>
          </div>
          <div className="week-bars">
            {metrics.weekly.map((w) => (
              <div className="week-bar" key={w.week} title={`Week ${w.week}: ${w.done}/${w.total} days`}>
                <div className="week-bar-pct">{w.pct}%</div>
                <div className="week-bar-track">
                  <div
                    className="week-bar-fill"
                    style={{
                      height: `${Math.max(w.pct, 3)}%`,
                      background:
                        w.week === metrics.currentWeek
                          ? 'linear-gradient(180deg,#5eead4,#14b8a6)'
                          : undefined,
                    }}
                  />
                </div>
                <div className="week-bar-label">W{w.week}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card pad-lg">
          <div className="card-head">
            <div>
              <div className="card-title">Today&apos;s focus</div>
              <div className="card-sub">Day {metrics.todayPlan.day} · {metrics.todayPlan.topic}</div>
            </div>
            <Badge tone={metrics.todayDone ? 'green' : 'amber'} dot>
              {metrics.todayDone ? 'Complete' : 'In progress'}
            </Badge>
          </div>
          <h3 style={{ fontSize: 16, marginBottom: 4 }}>{metrics.todayPlan.title}</h3>
          <p className="subtle" style={{ marginBottom: 12 }}>{formatLongDate(metrics.todayPlan.date)}</p>

          <div className="row wrap" style={{ gap: 6, marginBottom: 10 }}>
            <span className="chip">40 min learning</span>
            <span className="chip">35 min coding / DSA</span>
            <span className="chip">30 min implementation</span>
            <span className="chip">15 min career / revision</span>
          </div>

          <div className="day-objectives" style={{ marginTop: 0 }}>
            <h5>Learning &amp; practice activities</h5>
            <ul>
              {metrics.todayPlan.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <div className="day-deliverable">
            <Icon name="trophy" size={15} />
            <span><strong>Deliverable:</strong> {metrics.todayPlan.deliverable}</span>
          </div>

          <div className="day-foot">
            <span className="pill primary">
              <Icon name="clock" size={12} /> 120 min · Week {metrics.todayPlan.week}
            </span>
            <div className="row">
              <button className="btn btn-sm btn-outline" onClick={() => navigate('daily')}>
                Full plan
              </button>
              <button
                className={`btn btn-sm ${metrics.todayDone ? 'btn-outline' : 'btn-primary'}`}
                onClick={() => actions.toggleDay(metrics.todayPlan.day)}
              >
                <Icon name={metrics.todayDone ? 'refresh' : 'check'} size={13} />
                {metrics.todayDone ? 'Undo' : 'Mark done'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-3">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">This week</div>
              <div className="card-sub">Week {metrics.currentWeek} · {week.title}</div>
            </div>
            <button className="btn btn-xs btn-ghost" onClick={() => navigate('daily')}>View all</button>
          </div>
          <div className="list">
            {weekDays.map((d) => {
              const done = store.days[d.day]?.done
              const isCurrent = d.day === metrics.currentDay
              return (
                <div className="list-item" key={d.day} style={{ padding: '8px 0' }}>
                  <div
                    className="list-icon"
                    style={
                      done
                        ? { background: 'var(--green-soft)', color: 'var(--green-ink)' }
                        : isCurrent
                          ? { background: 'var(--primary-soft)', color: 'var(--primary)' }
                          : undefined
                    }
                  >
                    {done ? <Icon name="check" size={14} strokeWidth={3} /> : <span className="tiny" style={{ fontWeight: 700 }}>{d.day}</span>}
                  </div>
                  <div className="list-main">
                    <div className="list-title truncate">{d.title}</div>
                    <div className="list-sub">{formatDate(d.date)}</div>
                  </div>
                  {isCurrent ? <Badge tone="indigo">Now</Badge> : done ? <Badge tone="green">Done</Badge> : <span className="tiny subtle">—</span>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Technical readiness</div>
              <div className="card-sub">What the data says right now</div>
            </div>
            <Icon name="chart" size={17} />
          </div>
          <div className="stack" style={{ gap: 13 }}>
            <div>
              <div className="row-between mb-1">
                <span className="small" style={{ fontWeight: 600 }}>DSA solved</span>
                <span className="tiny subtle">{metrics.dsaSolved}/{metrics.dsaTotal}</span>
              </div>
              <Bar value={dsaPct} tone="green" />
            </div>
            <div>
              <div className="row-between mb-1">
                <span className="small" style={{ fontWeight: 600 }}>Interview topics completed</span>
                <span className="tiny subtle">{metrics.topicsCompleted}/{metrics.topicsTotal}</span>
              </div>
              <Bar value={topicPct} tone="indigo" />
            </div>
            <div>
              <div className="row-between mb-1">
                <span className="small" style={{ fontWeight: 600 }}>Portfolio project</span>
                <span className="tiny subtle">{metrics.portfolioPct}%</span>
              </div>
              <Bar value={metrics.portfolioPct} tone="amber" />
            </div>
            <div>
              <div className="row-between mb-1">
                <span className="small" style={{ fontWeight: 600 }}>Average confidence</span>
                <span className="tiny subtle">{metrics.avgConfidence}/5</span>
              </div>
              <Bar value={(metrics.avgConfidence / 5) * 100} tone="indigo" />
            </div>
          </div>
          <div className="divider" />
          <div className="row wrap" style={{ gap: 6 }}>
            <Badge tone="sky">{metrics.dsaAttempted} attempted</Badge>
            <Badge tone="rose">{metrics.dsaRevision} to revise</Badge>
            <Badge tone="violet">{metrics.topicsLearning} learning</Badge>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Career pipeline</div>
              <div className="card-sub">Real activity only — nothing invented</div>
            </div>
            <Icon name="briefcase" size={17} />
          </div>
          <div className="kv">
            <span>Applications logged</span>
            <strong>{metrics.applications}</strong>
          </div>
          <div className="kv">
            <span>Assessments</span>
            <strong>{metrics.assessments}</strong>
          </div>
          <div className="kv">
            <span>Interviews received</span>
            <strong>{metrics.interviews}</strong>
          </div>
          <div className="kv">
            <span>Offers</span>
            <strong>{metrics.offers}</strong>
          </div>
          <div className="kv">
            <span>Networking conversations</span>
            <strong>{metrics.conversations}</strong>
          </div>
          <div className="kv">
            <span>Companies researched</span>
            <strong>{metrics.researchDone}/{metrics.researchTotal || 0}</strong>
          </div>
          <div className="divider" />
          <div className="row-between mb-1">
            <span className="small" style={{ fontWeight: 600 }}>GHCI checklist</span>
            <span className="tiny subtle">{metrics.eventDone}/{metrics.eventTotal}</span>
          </div>
          <Bar value={metrics.eventPct} tone="green" />
          <div className="row wrap mt-2">
            <button className="btn btn-sm btn-outline" onClick={() => navigate('applications')}>Applications</button>
            <button className="btn btn-sm btn-outline" onClick={() => navigate('event')}>Event checklist</button>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Jump back in</div>
            <div className="card-sub">The four places you will use most this week</div>
          </div>
        </div>
        <div className="grid grid-4">
          {[
            { key: 'daily' as NavKey, icon: 'calendar' as const, title: 'Daily breakdown', sub: `${metrics.pendingDays} days still pending`, tone: 'indigo' as const },
            { key: 'dsa' as NavKey, icon: 'code' as const, title: 'DSA tracker', sub: `${metrics.dsaRevision} need revision`, tone: 'sky' as const },
            { key: 'interview' as NavKey, icon: 'target' as const, title: 'Interview prep', sub: `${metrics.mockOpen} mock questions open`, tone: 'violet' as const },
            { key: 'networking' as NavKey, icon: 'users' as const, title: 'Networking CRM', sub: 'Prepare your GHCI conversations', tone: 'teal' as const },
          ].map((q) => (
            <button
              key={q.key}
              className="card hoverable"
              style={{ textAlign: 'left', cursor: 'pointer' }}
              onClick={() => navigate(q.key)}
            >
              <div className="stat-icon" style={{ marginBottom: 10 }}>
                <Icon name={q.icon} size={17} />
              </div>
              <div className="list-title">{q.title}</div>
              <div className="list-sub">{q.sub}</div>
              <div className="row mt-2" style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 600 }}>
                Open <Icon name="arrowRight" size={13} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="card" style={{ background: 'linear-gradient(120deg,#fff,#f7f9ff)' }}>
        <div className="row-between wrap" style={{ gap: 16 }}>
          <div className="row" style={{ gap: 13 }}>
            <div className="stat-icon" style={{ background: 'var(--amber-soft)', color: 'var(--amber-ink)' }}>
              <Icon name="alert" size={17} />
            </div>
            <div>
              <div className="card-title">Keep the promise realistic</div>
              <div className="card-sub" style={{ maxWidth: 720 }}>
                GHCI 2027 is a career and networking opportunity, not a guaranteed interview or job offer. This tracker
                prepares you to show up well and follow up thoughtfully — it does not promise recruiter access.
              </div>
            </div>
          </div>
          <Badge tone="amber">20 Jan 2027 · Day 1 only</Badge>
        </div>
      </section>
    </div>
  )
}
