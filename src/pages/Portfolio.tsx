import React from 'react'
import { useStore } from '../store'
import { milestones, portfolioProject } from '../data/portfolio'
import type { MilestoneStatus } from '../types'
import { Badge, Bar, Check, Ring, Stat } from '../components/ui'
import { Icon } from '../components/Icon'

const statuses: MilestoneStatus[] = ['Not Started', 'In Progress', 'Complete']

function statusTone(s: MilestoneStatus) {
  if (s === 'Complete') return 'green' as const
  if (s === 'In Progress') return 'amber' as const
  return 'slate' as const
}

export function Portfolio() {
  const { store, actions, metrics } = useStore()
  const complete = milestones.filter((m) => store.milestones[m.id]?.status === 'Complete').length

  return (
    <div className="stack">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Portfolio project tracker</div>
          <h1 className="h1">{portfolioProject.name}</h1>
          <p>{portfolioProject.tagline}</p>
        </div>
        <Badge tone="indigo" dot>Week 6 build · deployable MVP</Badge>
      </div>

      <div className="grid grid-2">
        <div className="card pad-lg">
          <div className="row" style={{ gap: 22, flexWrap: 'wrap' }}>
            <Ring value={metrics.portfolioPct} size={138} label="project" />
            <div style={{ flex: 1, minWidth: 190 }}>
              <div className="card-title" style={{ marginBottom: 4 }}>Overall progress</div>
              <div className="card-sub mb-2">{metrics.portfolioTasksDone} of {metrics.portfolioTasksTotal} tasks complete</div>
              <div className="kv"><span>Milestones complete</span><strong>{complete}/10</strong></div>
              <div className="kv"><span>Tasks complete</span><strong>{metrics.portfolioTasksDone}</strong></div>
              <div className="kv"><span>Tasks remaining</span><strong>{metrics.portfolioTasksTotal - metrics.portfolioTasksDone}</strong></div>
              <div className="mt-2"><Bar value={metrics.portfolioPct} tone={metrics.portfolioPct === 100 ? 'green' : 'indigo'} /></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Stack & guardrails</div>
              <div className="card-sub">A focused MVP, not an over-engineered platform</div>
            </div>
            <Icon name="shield" size={17} />
          </div>
          <div className="chip-list mb-2">
            {portfolioProject.stack.map((s) => <span className="chip" key={s}>{s}</span>)}
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {portfolioProject.constraints.map((c) => (
              <li key={c} style={{ display: 'flex', gap: 8, fontSize: 12.5, color: 'var(--ink-2)' }}>
                <span style={{ color: 'var(--green-ink)', fontWeight: 800 }}>✓</span>
                {c}
              </li>
            ))}
          </ul>
          <div className="divider" />
          <div className="grid grid-3" style={{ gap: 8 }}>
            <div className="stat" style={{ padding: '10px 12px', boxShadow: 'none' }}>
              <div className="stat-value" style={{ fontSize: 20, marginTop: 0 }}>{complete}<small>/10</small></div>
              <div className="stat-label">Milestones</div>
            </div>
            <div className="stat" style={{ padding: '10px 12px', boxShadow: 'none' }}>
              <div className="stat-value" style={{ fontSize: 20, marginTop: 0 }}>{metrics.portfolioPct}<small>%</small></div>
              <div className="stat-label">Tasks done</div>
            </div>
            <div className="stat" style={{ padding: '10px 12px', boxShadow: 'none' }}>
              <div className="stat-value" style={{ fontSize: 20, marginTop: 0 }}>{metrics.portfolioTasksTotal - metrics.portfolioTasksDone}</div>
              <div className="stat-label">Remaining</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-4">
        <Stat label="Milestones complete" value={<>{complete}<small>/ 10</small></>} icon="trophy" tone="indigo" foot={<span>Scope through documentation</span>} />
        <Stat label="Tasks complete" value={<>{metrics.portfolioTasksDone}<small>/ {metrics.portfolioTasksTotal}</small></>} icon="check" tone="green" foot={<span>Concrete, demoable progress</span>} />
        <Stat label="Tasks remaining" value={metrics.portfolioTasksTotal - metrics.portfolioTasksDone} icon="clock" tone="amber" foot={<span>Keep the MVP tight</span>} />
        <Stat label="Project progress" value={<>{metrics.portfolioPct}<small>%</small></>} icon="layers" tone="violet" foot={<span>Deployed and documented wins</span>} />
      </div>

      <div className="grid grid-2">
        {milestones.map((m, idx) => {
          const state = store.milestones[m.id] ?? { status: 'Not Started' as MilestoneStatus, notes: '', tasks: {} }
          const total = m.tasks.length
          const done = m.tasks.filter((t) => state.tasks[t.id]).length
          const pct = total ? Math.round((done / total) * 100) : 0
          return (
            <article className="milestone" key={m.id}>
              <div className="milestone-head">
                <div className="ms-num">{idx + 1}</div>
                <div className="ms-main">
                  <div className="row-between wrap" style={{ gap: 8 }}>
                    <div className="ms-title">{m.title}</div>
                    <Badge tone={statusTone(state.status)}>{state.status}</Badge>
                  </div>
                  <div className="ms-desc">{m.description}</div>
                  <div className="row mt-2" style={{ gap: 9 }}>
                    <div style={{ flex: 1 }}><Bar value={pct} tone={pct === 100 ? 'green' : 'indigo'} slim /></div>
                    <span className="tiny" style={{ fontWeight: 700 }}>{done}/{total}</span>
                  </div>
                </div>
              </div>
              <div className="ms-body">
                <div className="ms-tasks">
                  {m.tasks.map((t) => (
                    <Check
                      key={t.id}
                      checked={Boolean(state.tasks[t.id])}
                      onChange={() => actions.toggleMilestoneTask(m.id, t.id)}
                      label={t.label}
                    />
                  ))}
                </div>
                <div className="ms-foot">
                  <select
                    className="select"
                    value={state.status}
                    onChange={(e) => actions.updateMilestone(m.id, { status: e.target.value as MilestoneStatus })}
                    aria-label={`Status for ${m.title}`}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {pct === 100 && state.status !== 'Complete' ? (
                    <button className="btn btn-xs btn-outline" onClick={() => actions.updateMilestone(m.id, { status: 'Complete' })}>
                      Mark milestone complete
                    </button>
                  ) : null}
                </div>
                <div className="field mt-2">
                  <label className="label">Milestone notes</label>
                  <textarea
                    className="textarea"
                    style={{ minHeight: 56, fontSize: 12 }}
                    placeholder="Decisions, links, blockers, what done means for this milestone…"
                    value={state.notes}
                    onChange={(e) => actions.updateMilestone(m.id, { notes: e.target.value })}
                  />
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="card" style={{ background: 'linear-gradient(120deg,#fff,#f4f7ff)' }}>
        <div className="row-between wrap" style={{ gap: 14 }}>
          <div className="row" style={{ gap: 12 }}>
            <div className="stat-icon" style={{ background: 'var(--violet-soft)', color: 'var(--violet-ink)' }}>
              <Icon name="sparkles" size={17} />
            </div>
            <div>
              <div className="card-title">Definition of done for the demo</div>
              <div className="card-sub" style={{ maxWidth: 760 }}>
                A public URL, a GitHub repo with a real README, an architecture diagram, screenshots and a three-minute
                walkthrough. If a feature cannot be demoed, it is not part of the story yet.
              </div>
            </div>
          </div>
          <Badge tone="violet">Week 6 deliverable</Badge>
        </div>
      </div>
    </div>
  )
}
