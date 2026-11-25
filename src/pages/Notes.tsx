import React, { useMemo, useState } from 'react'
import { useStore } from '../store'
import type { NoteCategory } from '../types'
import { Badge, Empty, Modal, SearchInput, Stat, Tabs } from '../components/ui'
import { Icon } from '../components/Icon'
import { formatDate, todayISO } from '../lib/date'

const categories: NoteCategory[] = ['Reflection', 'Mock Interview', 'Learning', 'Follow-up', 'Idea']

function categoryTone(c: NoteCategory) {
  if (c === 'Reflection') return 'violet' as const
  if (c === 'Mock Interview') return 'rose' as const
  if (c === 'Learning') return 'indigo' as const
  if (c === 'Follow-up') return 'amber' as const
  return 'teal' as const
}

const prompts = [
  'What did I learn this week that I can explain simply?',
  'Which interview answer still feels weak, and why?',
  'What did a mock interview expose that I was avoiding?',
  'What follow-up needs to happen in the next 48 hours?',
]

export function Notes() {
  const { store, actions, metrics } = useStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'All' | NoteCategory>('All')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<{ date: string; category: NoteCategory; title: string; body: string }>({
    date: todayISO(),
    category: 'Reflection',
    title: '',
    body: '',
  })

  const filtered = useMemo(() => {
    return [...store.notes]
      .filter((n) => {
        if (category !== 'All' && n.category !== category) return false
        if (query.trim()) {
          const q = query.toLowerCase()
          if (!`${n.title} ${n.body} ${n.category}`.toLowerCase().includes(q)) return false
        }
        return true
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [store.notes, category, query])

  const openAdd = (prompt?: string) => {
    setForm({ date: todayISO(), category: 'Reflection', title: prompt ?? '', body: '' })
    setOpen(true)
  }

  const save = () => {
    if (!form.title.trim() && !form.body.trim()) return
    actions.addNote({
      date: form.date || todayISO(),
      category: form.category,
      title: form.title.trim() || 'Untitled note',
      body: form.body.trim(),
    })
    setOpen(false)
  }

  return (
    <div className="stack">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Thinking in writing</div>
          <h1 className="h1">Notes, reflections & follow-ups</h1>
          <p>
            A private log for what you learn, what breaks, what you fix and what you owe someone. Reflections are how
            preparation turns into judgement.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => openAdd()}>
          <Icon name="plus" size={15} /> New note
        </button>
      </div>

      <div className="grid grid-4">
        <Stat label="Total notes" value={metrics.notesCount} icon="notes" tone="indigo" foot={<span>Your thinking trail</span>} />
        <Stat label="Reflections" value={store.notes.filter((n) => n.category === 'Reflection').length} icon="book" tone="violet" foot={<span>Weekly reviews and lessons</span>} />
        <Stat label="Mock learnings" value={store.notes.filter((n) => n.category === 'Mock Interview').length} icon="target" tone="rose" foot={<span>{metrics.mockOpen} questions still open</span>} />
        <Stat label="Follow-ups" value={store.notes.filter((n) => n.category === 'Follow-up').length} icon="mail" tone="amber" foot={<span>People and promises</span>} />
      </div>

      <div className="card">
        <div className="row-between wrap" style={{ gap: 12 }}>
          <Tabs<'All' | NoteCategory>
            items={[
              { key: 'All', label: 'All', count: store.notes.length },
              ...categories.map((c) => ({ key: c, label: c, count: store.notes.filter((n) => n.category === c).length })),
            ]}
            value={category}
            onChange={setCategory}
          />
          <SearchInput value={query} onChange={setQuery} placeholder="Search notes…" />
        </div>
      </div>

      {store.notes.length === 0 ? (
        <Empty
          icon="notes"
          title="Nothing written yet"
          text="Start with today's reflection. A few honest lines after a study session are worth more than a perfect template."
          action={<button className="btn btn-outline" onClick={() => openAdd()}>Write your first note</button>}
        />
      ) : filtered.length === 0 ? (
        <Empty icon="search" title="No notes match" text="Try another category or clear the search." />
      ) : (
        <div className="grid grid-2">
          {filtered.map((n) => (
            <article className="note-card" key={n.id}>
              <div className="note-head">
                <div className="row wrap" style={{ gap: 7 }}>
                  <Badge tone={categoryTone(n.category)}>{n.category}</Badge>
                  <span className="tiny subtle">{formatDate(n.date, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => actions.removeNote(n.id)} aria-label="Delete note">
                  <Icon name="trash" size={13} />
                </button>
              </div>
              <div className="note-title">{n.title}</div>
              {n.body ? <div className="note-body mt-1">{n.body}</div> : null}
            </article>
          ))}
        </div>
      )}

      <div className="card" style={{ background: 'linear-gradient(120deg,#fff,#f7f5ff)' }}>
        <div className="card-head">
          <div>
            <div className="card-title">Reflection prompts</div>
            <div className="card-sub">Use one after each review day or mock interview</div>
          </div>
          <Icon name="sparkles" size={17} />
        </div>
        <div className="grid grid-2" style={{ gap: 9 }}>
          {prompts.map((p) => (
            <button
              key={p}
              className="app-card"
              style={{ textAlign: 'left', cursor: 'pointer' }}
              onClick={() => openAdd(p)}
            >
              <div className="row" style={{ gap: 10 }}>
                <div className="list-icon" style={{ background: 'var(--violet-soft)', color: 'var(--violet-ink)' }}>
                  <Icon name="notes" size={14} />
                </div>
                <div className="small" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{p}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New note"
        subtitle="Be specific and honest. Future you is the reader."
        wide
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={save} disabled={!form.title.trim() && !form.body.trim()}>
              Save note
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="field">
            <label className="label">Date</label>
            <input className="input" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="field">
            <label className="label">Category</label>
            <select className="select" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as NoteCategory }))}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field full">
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="What is this note about?" />
          </div>
          <div className="field full">
            <label className="label">Note</label>
            <textarea
              className="textarea"
              style={{ minHeight: 160 }}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="What happened, what you learned, what you will do next…"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
