import React, { useMemo, useState } from 'react'
import { useStore } from '../store'
import { dsaTopics } from '../data/dsa'
import type { Difficulty, DsaProblem, DsaStatus } from '../types'
import { Badge, Bar, Empty, Modal, SearchInput, Stat } from '../components/ui'
import { Icon } from '../components/Icon'
import { formatDate, todayISO } from '../lib/date'

const statuses: DsaStatus[] = ['Not Started', 'Attempted', 'Solved', 'Needs Revision']
const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard']

function statusTone(s: DsaStatus) {
  if (s === 'Solved') return 'green' as const
  if (s === 'Attempted') return 'amber' as const
  if (s === 'Needs Revision') return 'rose' as const
  return 'slate' as const
}

function diffTone(d: Difficulty) {
  if (d === 'Easy') return 'green' as const
  if (d === 'Medium') return 'amber' as const
  return 'rose' as const
}

const emptyForm = (): Omit<DsaProblem, 'id'> => ({
  name: '',
  topic: 'Arrays',
  difficulty: 'Easy',
  platform: 'LeetCode',
  link: '',
  dateAttempted: '',
  status: 'Not Started',
  timeTaken: '',
  notes: '',
  solutionLink: '',
})

export function Dsa() {
  const { store, actions, metrics } = useStore()
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [status, setStatus] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<DsaProblem, 'id'>>(emptyForm)

  const filtered = useMemo(() => {
    return store.dsa.filter((p) => {
      if (topic !== 'all' && p.topic !== topic) return false
      if (difficulty !== 'all' && p.difficulty !== difficulty) return false
      if (status !== 'all' && p.status !== status) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        if (!`${p.name} ${p.topic} ${p.notes}`.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [store.dsa, topic, difficulty, status, query])

  const revision = store.dsa.filter((p) => p.status === 'Needs Revision')

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm())
    setModalOpen(true)
  }

  const openEdit = (p: DsaProblem) => {
    setEditingId(p.id)
    const { id, ...rest } = p
    setForm(rest)
    setModalOpen(true)
  }

  const save = () => {
    if (!form.name.trim()) return
    if (editingId) {
      actions.updateDsa(editingId, form)
    } else {
      actions.addDsa(form)
    }
    setModalOpen(false)
  }

  const set = <K extends keyof Omit<DsaProblem, 'id'>>(key: K, value: Omit<DsaProblem, 'id'>[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const topicStats = dsaTopics.map((t) => {
    const list = store.dsa.filter((p) => p.topic === t)
    const solved = list.filter((p) => p.status === 'Solved').length
    return { topic: t, total: list.length, solved, pct: list.length ? Math.round((solved / list.length) * 100) : 0 }
  })

  return (
    <div className="stack">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Patterns over volume</div>
          <h1 className="h1">DSA tracker</h1>
          <p>
            A curated list across the patterns that appear in full-stack interviews. The target is understanding, not
            hundreds of problems: aim to explain the pattern, the invariant and the complexity.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Icon name="plus" size={15} /> Add problem
        </button>
      </div>

      <div className="grid grid-4">
        <Stat label="Problems solved" value={<>{metrics.dsaSolved}<small>/ {metrics.dsaTotal}</small></>} icon="check" tone="green" foot={<span>{metrics.dsaPct}% of your list</span>} />
        <Stat label="Attempted" value={metrics.dsaAttempted} icon="clock" tone="amber" foot={<span>Keep going — attempted is progress</span>} />
        <Stat label="Needs revision" value={metrics.dsaRevision} icon="refresh" tone="rose" foot={<span>Re-solve without notes</span>} />
        <Stat label="Revision list" value={revision.length} icon="book" tone="indigo" foot={<span>Below the filters</span>} />
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Topic-wise progress</div>
              <div className="card-sub">Solved / total per pattern</div>
            </div>
            <Icon name="chart" size={17} />
          </div>
          <div className="stack" style={{ gap: 4 }}>
            {topicStats.map((t) => (
              <div className="topic-progress-row" key={t.topic}>
                <span className="tp-name">{t.topic}</span>
                <Bar value={t.pct} tone={t.pct === 100 ? 'green' : 'indigo'} slim />
                <span className="tp-count">{t.solved}/{t.total}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Revision list</div>
              <div className="card-sub">Problems you marked as needing another pass</div>
            </div>
            <Badge tone={revision.length ? 'rose' : 'green'}>{revision.length} open</Badge>
          </div>
          {revision.length === 0 ? (
            <Empty
              icon="check"
              title="Nothing queued for revision"
              text="When a problem still feels shaky, set its status to Needs Revision and it will appear here."
            />
          ) : (
            <div className="list">
              {revision.map((p) => (
                <div className="list-item" key={p.id}>
                  <div className="list-icon" style={{ background: 'var(--rose-soft)', color: 'var(--rose-ink)' }}>
                    <Icon name="refresh" size={14} />
                  </div>
                  <div className="list-main">
                    <div className="list-title">{p.name}</div>
                    <div className="list-sub">{p.topic} · {p.difficulty}{p.notes ? ` · ${p.notes}` : ''}</div>
                  </div>
                  {p.link ? (
                    <a className="btn btn-xs btn-outline" href={p.link} target="_blank" rel="noreferrer">
                      Open <Icon name="external" size={11} />
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Problem list</div>
            <div className="card-sub">{filtered.length} of {store.dsa.length} problems shown</div>
          </div>
        </div>
        <div className="filters">
          <SearchInput value={query} onChange={setQuery} placeholder="Search problems or notes…" />
          <select className="select" value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Filter by topic">
            <option value="all">All topics</option>
            {dsaTopics.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="Filter by difficulty">
            <option value="all">All difficulties</option>
            {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            <option value="all">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {(topic !== 'all' || difficulty !== 'all' || status !== 'all' || query) ? (
            <button className="btn btn-sm btn-ghost" onClick={() => { setTopic('all'); setDifficulty('all'); setStatus('all'); setQuery('') }}>
              Clear
            </button>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <Empty icon="code" title="No problems match" text="Adjust the filters or add a new problem to your list." action={<button className="btn btn-outline" onClick={openAdd}>Add problem</button>} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Topic</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                  <th>Attempted</th>
                  <th>Time</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div className="tiny subtle">{p.platform}</div>
                    </td>
                    <td><span className="pill">{p.topic}</span></td>
                    <td><Badge tone={diffTone(p.difficulty)}>{p.difficulty}</Badge></td>
                    <td>
                      <select
                        className="select"
                        style={{ width: 132, padding: '4px 26px 4px 8px', fontSize: 11.5 }}
                        value={p.status}
                        onChange={(e) => actions.updateDsa(p.id, { status: e.target.value as DsaStatus })}
                        aria-label={`Status for ${p.name}`}
                      >
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="nowrap">{p.dateAttempted ? formatDate(p.dateAttempted) : <span className="subtle">—</span>}</td>
                    <td className="nowrap">{p.timeTaken || <span className="subtle">—</span>}</td>
                    <td>
                      <div className="row" style={{ justifyContent: 'flex-end', gap: 5 }}>
                        {p.link ? (
                          <a className="icon-btn" style={{ width: 29, height: 29 }} href={p.link} target="_blank" rel="noreferrer" aria-label="Open problem">
                            <Icon name="external" size={13} />
                          </a>
                        ) : null}
                        {p.solutionLink ? (
                          <a className="icon-btn" style={{ width: 29, height: 29 }} href={p.solutionLink} target="_blank" rel="noreferrer" aria-label="Open solution">
                            <Icon name="link" size={13} />
                          </a>
                        ) : null}
                        <button className="icon-btn" style={{ width: 29, height: 29 }} onClick={() => openEdit(p)} aria-label="Edit problem">
                          <Icon name="settings" size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit problem' : 'Add a problem'}
        subtitle="Track the pattern, the attempt and the honest result."
        wide
        footer={
          <>
            {editingId ? (
              <button
                className="btn btn-danger"
                onClick={() => {
                  actions.removeDsa(editingId)
                  setModalOpen(false)
                }}
              >
                <Icon name="trash" size={14} /> Delete
              </button>
            ) : null}
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={save} disabled={!form.name.trim()}>
              {editingId ? 'Save changes' : 'Add problem'}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="field full">
            <label className="label">Problem name</label>
            <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Longest Substring Without Repeating Characters" />
          </div>
          <div className="field">
            <label className="label">Topic</label>
            <select className="select" value={form.topic} onChange={(e) => set('topic', e.target.value)}>
              {dsaTopics.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="label">Difficulty</label>
            <select className="select" value={form.difficulty} onChange={(e) => set('difficulty', e.target.value as Difficulty)}>
              {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="label">Platform</label>
            <input className="input" value={form.platform} onChange={(e) => set('platform', e.target.value)} placeholder="LeetCode" />
          </div>
          <div className="field">
            <label className="label">Status</label>
            <select className="select" value={form.status} onChange={(e) => set('status', e.target.value as DsaStatus)}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="field full">
            <label className="label">Problem link</label>
            <input className="input" value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="https://…" />
          </div>
          <div className="field">
            <label className="label">Date attempted</label>
            <input className="input" type="date" value={form.dateAttempted} max={todayISO()} onChange={(e) => set('dateAttempted', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Time taken</label>
            <input className="input" value={form.timeTaken} onChange={(e) => set('timeTaken', e.target.value)} placeholder="e.g. 28 min" />
          </div>
          <div className="field full">
            <label className="label">Solution link</label>
            <input className="input" value={form.solutionLink} onChange={(e) => set('solutionLink', e.target.value)} placeholder="GitHub or notes URL" />
          </div>
          <div className="field full">
            <label className="label">Notes</label>
            <textarea className="textarea" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Pattern, invariant, mistake, complexity…" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
