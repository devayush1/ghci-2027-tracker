import React, { useMemo, useState } from 'react'
import { useStore } from '../store'
import { interviewCategories, interviewTopics } from '../data/interview'
import type { TopicStatus } from '../types'
import { Badge, Bar, Empty, SearchInput, Stat, Stars } from '../components/ui'
import { Icon } from '../components/Icon'
import { formatDate, todayISO } from '../lib/date'

const statuses: TopicStatus[] = ['Not Started', 'Learning', 'Completed']

function statusTone(s: TopicStatus) {
  if (s === 'Completed') return 'green' as const
  if (s === 'Learning') return 'amber' as const
  return 'slate' as const
}

export function Interview() {
  const { store, actions, metrics } = useStore()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [mockForm, setMockForm] = useState({ area: 'JavaScript', question: '', answer: '' })

  const filtered = useMemo(() => {
    return interviewTopics.filter((t) => {
      if (category !== 'All' && t.category !== category) return false
      const state = store.topics[t.id]
      if (statusFilter !== 'all' && state?.status !== statusFilter) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        if (!`${t.title} ${t.prompt} ${t.category}`.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [category, query, statusFilter, store.topics])

  const categoryStats = interviewCategories.map((c) => {
    const list = interviewTopics.filter((t) => t.category === c)
    const done = list.filter((t) => store.topics[t.id]?.status === 'Completed').length
    return { category: c, total: list.length, done, pct: list.length ? Math.round((done / list.length) * 100) : 0 }
  })

  const openMocks = store.mockQuestions.filter((q) => !q.resolved)

  const addMock = () => {
    if (!mockForm.question.trim()) return
    actions.addMockQuestion({
      area: mockForm.area,
      question: mockForm.question.trim(),
      answer: mockForm.answer.trim(),
      resolved: false,
      date: todayISO(),
    })
    setMockForm((f) => ({ ...f, question: '', answer: '' }))
  }

  return (
    <div className="stack">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Concepts, confidence and explanation</div>
          <h1 className="h1">Technical interview preparation</h1>
          <p>
            Each topic has a concept, a practical example, an interview explanation and a confidence rating. Rate
            yourself honestly — confidence is a signal for revision, not a performance metric.
          </p>
        </div>
        <div className="row wrap">
          <Badge tone="green">{metrics.topicsCompleted} completed</Badge>
          <Badge tone="amber">{metrics.topicsLearning} learning</Badge>
          <Badge tone="indigo">Avg confidence {metrics.avgConfidence}/5</Badge>
        </div>
      </div>

      <div className="grid grid-4">
        <Stat label="Topics completed" value={<>{metrics.topicsCompleted}<small>/ {metrics.topicsTotal}</small></>} icon="check" tone="green" foot={<span>{Math.round((metrics.topicsCompleted / metrics.topicsTotal) * 100)}% coverage</span>} />
        <Stat label="In progress" value={metrics.topicsLearning} icon="book" tone="amber" foot={<span>Keep notes specific</span>} />
        <Stat label="Average confidence" value={<>{metrics.avgConfidence}<small>/5</small></>} icon="star" tone="violet" foot={<span>Below 3 means revise</span>} />
        <Stat label="Unresolved mock questions" value={openMocks.length} icon="alert" tone={openMocks.length ? 'rose' : 'green'} foot={<span>{metrics.notesCount} reflections saved</span>} />
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Coverage by area</div>
            <div className="card-sub">The nine areas that matter for a React + Node full-stack interview</div>
          </div>
          <Icon name="target" size={17} />
        </div>
        <div className="grid grid-3" style={{ gap: 4 }}>
          {categoryStats.map((c) => (
            <div className="topic-progress-row" key={c.category}>
              <span className="tp-name" style={{ width: 108 }}>{c.category}</span>
              <Bar value={c.pct} tone={c.pct === 100 ? 'green' : 'indigo'} slim />
              <span className="tp-count">{c.done}/{c.total}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="row-between wrap" style={{ gap: 12 }}>
          <div className="tabs">
            {['All', ...interviewCategories].map((c) => {
              const list = c === 'All' ? interviewTopics : interviewTopics.filter((t) => t.category === c)
              const done = list.filter((t) => store.topics[t.id]?.status === 'Completed').length
              return (
                <button key={c} className={`tab${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>
                  {c} ({done}/{list.length})
                </button>
              )
            })}
          </div>
          <div className="row wrap">
            <SearchInput value={query} onChange={setQuery} placeholder="Search concepts…" />
            <select className="select" style={{ width: 140 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
              <option value="all">All statuses</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Empty icon="target" title="No topics match" text="Clear the search or choose a different area." />
      ) : (
        <div className="grid grid-2">
          {filtered.map((t) => {
            const state = store.topics[t.id] ?? { status: 'Not Started' as TopicStatus, confidence: 1, notes: '', example: t.example, revisionDate: '' }
            const due = state.revisionDate && state.revisionDate <= todayISO()
            return (
              <article className="topic-card" key={t.id}>
                <div className="topic-top">
                  <div>
                    <div className="row wrap" style={{ gap: 7, marginBottom: 3 }}>
                      <span className="badge b-slate">{t.category}</span>
                      {due ? <Badge tone="rose" dot>Revision due</Badge> : null}
                    </div>
                    <div className="topic-title">{t.title}</div>
                    <div className="topic-prompt">{t.prompt}</div>
                  </div>
                  <Badge tone={statusTone(state.status)}>{state.status}</Badge>
                </div>

                <div className="topic-example">
                  <strong>Practical example</strong>
                  <input
                    className="input"
                    style={{ border: 'none', padding: '0', background: 'transparent', fontSize: 11.5 }}
                    value={state.example}
                    onChange={(e) => actions.updateTopic(t.id, { example: e.target.value })}
                    aria-label={`Practical example for ${t.title}`}
                  />
                </div>

                <div className="topic-controls">
                  <select
                    className="select"
                    value={state.status}
                    onChange={(e) => actions.updateTopic(t.id, { status: e.target.value as TopicStatus })}
                    aria-label={`Status for ${t.title}`}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="row" style={{ gap: 6 }}>
                    <span className="tiny subtle">Confidence</span>
                    <Stars value={state.confidence} onChange={(v) => actions.updateTopic(t.id, { confidence: v })} />
                  </div>
                  <div className="row" style={{ gap: 5, marginLeft: 'auto' }}>
                    <span className="tiny subtle">Revise</span>
                    <input
                      type="date"
                      className="input"
                      style={{ width: 128, padding: '5px 8px', fontSize: 11.5 }}
                      value={state.revisionDate}
                      onChange={(e) => actions.updateTopic(t.id, { revisionDate: e.target.value })}
                      aria-label={`Revision date for ${t.title}`}
                    />
                  </div>
                </div>

                <div className="topic-notes">
                  <textarea
                    className="textarea"
                    placeholder="Interview explanation: how would you say this out loud? Include one trade-off or production example."
                    value={state.notes}
                    onChange={(e) => actions.updateTopic(t.id, { notes: e.target.value })}
                  />
                </div>
              </article>
            )
          })}
        </div>
      )}

      <div className="grid grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Questions I could not answer</div>
              <div className="card-sub">Log every stumble from a mock, then close it after a real revision</div>
            </div>
            <Badge tone={openMocks.length ? 'rose' : 'green'}>{openMocks.length} open</Badge>
          </div>

          <div className="form-grid" style={{ marginBottom: 14 }}>
            <div className="field">
              <label className="label">Area</label>
              <select className="select" value={mockForm.area} onChange={(e) => setMockForm((f) => ({ ...f, area: e.target.value }))}>
                {interviewCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label">Question</label>
              <input className="input" value={mockForm.question} onChange={(e) => setMockForm((f) => ({ ...f, question: e.target.value }))} placeholder="What did you get wrong?" />
            </div>
            <div className="field full">
              <label className="label">What I learned / the better answer</label>
              <textarea className="textarea" style={{ minHeight: 60 }} value={mockForm.answer} onChange={(e) => setMockForm((f) => ({ ...f, answer: e.target.value }))} placeholder="Write the corrected explanation while it is fresh." />
            </div>
            <div className="full">
              <button className="btn btn-primary" onClick={addMock} disabled={!mockForm.question.trim()}>
                <Icon name="plus" size={14} /> Log question
              </button>
            </div>
          </div>

          {store.mockQuestions.length === 0 ? (
            <Empty icon="notes" title="No mock questions logged yet" text="After every mock interview, add the questions you could not answer. This becomes your highest-value revision list." />
          ) : (
            <div className="list">
              {store.mockQuestions.map((q) => (
                <div className="list-item" key={q.id}>
                  <div className="list-icon" style={q.resolved ? { background: 'var(--green-soft)', color: 'var(--green-ink)' } : { background: 'var(--rose-soft)', color: 'var(--rose-ink)' }}>
                    <Icon name={q.resolved ? 'check' : 'alert'} size={14} />
                  </div>
                  <div className="list-main">
                    <div className="row wrap" style={{ gap: 6 }}>
                      <span className="badge b-slate">{q.area}</span>
                      <span className="tiny subtle">{formatDate(q.date)}</span>
                    </div>
                    <div className="list-title" style={{ marginTop: 3 }}>{q.question}</div>
                    {q.answer ? <div className="list-sub" style={{ whiteSpace: 'pre-wrap' }}>{q.answer}</div> : null}
                    <div className="row mt-1" style={{ gap: 6 }}>
                      <button className="btn btn-xs btn-outline" onClick={() => actions.updateMockQuestion(q.id, { resolved: !q.resolved })}>
                        {q.resolved ? 'Reopen' : 'Mark resolved'}
                      </button>
                      <button className="btn btn-xs btn-ghost" onClick={() => actions.removeMockQuestion(q.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="card-head">
            <div>
              <div className="card-title">How to use this section</div>
              <div className="card-sub">Depth beats a long checklist</div>
            </div>
          </div>
          <div className="list">
            {[
              { icon: 'target' as const, title: 'Explain, do not recite', text: 'Write the answer as you would say it out loud, including one trade-off.' },
              { icon: 'code' as const, title: 'Keep the example runnable', text: 'Every concept should have a small snippet you can reproduce from memory.' },
              { icon: 'star' as const, title: 'Rate confidence honestly', text: 'A 4 or 5 means you can teach it. Below 3 means it goes on the revision list.' },
              { icon: 'refresh' as const, title: 'Set a revision date', text: 'Spaced revision is how concepts survive the interview week.' },
            ].map((r) => (
              <div className="list-item" key={r.title}>
                <div className="list-icon"><Icon name={r.icon} size={14} /></div>
                <div className="list-main">
                  <div className="list-title">{r.title}</div>
                  <div className="list-sub">{r.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="row-between">
            <span className="small" style={{ fontWeight: 600 }}>Overall coverage</span>
            <span className="tiny subtle">{metrics.topicsCompleted}/{metrics.topicsTotal}</span>
          </div>
          <div className="mt-1">
            <Bar value={metrics.topicsTotal ? (metrics.topicsCompleted / metrics.topicsTotal) * 100 : 0} tone="green" />
          </div>
        </div>
      </div>
    </div>
  )
}
