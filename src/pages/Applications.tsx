import React, { useMemo, useState } from 'react'
import { useStore } from '../store'
import type { ApplicationStatus, JobApplication } from '../types'
import { Badge, Empty, Modal, SearchInput, Stat } from '../components/ui'
import { Icon } from '../components/Icon'
import { formatDate, relativeLabel, todayISO } from '../lib/date'

const statuses: ApplicationStatus[] = ['Interested', 'Applied', 'Assessment', 'Interview', 'Rejected', 'Offer']

function statusTone(s: ApplicationStatus) {
  if (s === 'Offer') return 'green' as const
  if (s === 'Interview') return 'indigo' as const
  if (s === 'Assessment') return 'sky' as const
  if (s === 'Rejected') return 'rose' as const
  if (s === 'Applied') return 'amber' as const
  return 'slate' as const
}

const emptyForm = (): Omit<JobApplication, 'id'> => ({
  company: '',
  role: '',
  url: '',
  location: '',
  compensation: '',
  dateApplied: '',
  source: '',
  referral: '',
  status: 'Interested',
  followUpDate: '',
  notes: '',
})

export function Applications() {
  const { store, actions, metrics } = useStore()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<JobApplication, 'id'>>(emptyForm)

  const filtered = useMemo(() => {
    return [...store.applications]
      .filter((a) => {
        if (status !== 'all' && a.status !== status) return false
        if (query.trim()) {
          const q = query.toLowerCase()
          if (!`${a.company} ${a.role} ${a.location} ${a.source} ${a.notes}`.toLowerCase().includes(q)) return false
        }
        return true
      })
      .sort((a, b) => (b.dateApplied || '').localeCompare(a.dateApplied || ''))
  }, [store.applications, status, query])

  const followUpsDue = store.applications.filter(
    (a) => a.followUpDate && a.followUpDate <= todayISO() && a.status !== 'Rejected' && a.status !== 'Offer',
  )

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm())
    setOpen(true)
  }

  const openEdit = (a: JobApplication) => {
    setEditingId(a.id)
    const { id, ...rest } = a
    setForm(rest)
    setOpen(true)
  }

  const save = () => {
    if (!form.company.trim() || !form.role.trim()) return
    if (editingId) actions.updateApplication(editingId, form)
    else actions.addApplication(form)
    setOpen(false)
  }

  const set = <K extends keyof Omit<JobApplication, 'id'>>(key: K, value: Omit<JobApplication, 'id'>[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="stack">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Real applications only</div>
          <h1 className="h1">Job application tracker</h1>
          <p>
            Log only applications you have actually submitted. The tracker is deliberately empty until you add real
            activity — no invented companies, contacts or outcomes.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Icon name="plus" size={15} /> Add application
        </button>
      </div>

      <div className="grid grid-4">
        <Stat label="Applications" value={metrics.applications} icon="briefcase" tone="indigo" foot={<span>{store.applications.filter((a) => a.status === 'Applied').length} awaiting response</span>} />
        <Stat label="Interviews received" value={metrics.interviews} icon="users" tone="green" foot={<span>{metrics.interviewRate}% of applications</span>} />
        <Stat label="Assessments" value={metrics.assessments} icon="code" tone="sky" foot={<span>{metrics.rejections} rejections</span>} />
        <Stat label="Offers" value={metrics.offers} icon="trophy" tone={metrics.offers ? 'green' : 'slate'} foot={<span>Target: {store.profile.targetComp}</span>} />
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Pipeline</div>
            <div className="card-sub">Current status across all logged applications</div>
          </div>
          <Badge tone="indigo">{metrics.applications} total</Badge>
        </div>
        <div className="pipeline">
          {statuses.map((s) => {
            const count = store.applications.filter((a) => a.status === s).length
            return (
              <button
                key={s}
                className="pipeline-step"
                onClick={() => setStatus(status === s ? 'all' : s)}
                style={{ textAlign: 'left', cursor: 'pointer', borderColor: status === s ? 'var(--primary)' : undefined }}
              >
                <div className="ps-label">{s}</div>
                <div className="ps-value">{count}</div>
              </button>
            )
          })}
        </div>
        {followUpsDue.length > 0 ? (
          <div className="next-action" style={{ marginTop: 4 }}>
            <div className="na-left">
              <div className="na-icon" style={{ background: 'linear-gradient(140deg,#f59e0b,#f97316)' }}>
                <Icon name="mail" size={18} />
              </div>
              <div>
                <div className="na-title">{followUpsDue.length} follow-up{followUpsDue.length > 1 ? 's' : ''} due</div>
                <div className="na-sub">{followUpsDue.map((a) => a.company).join(' · ')}</div>
              </div>
            </div>
            <Badge tone="amber">Check your inbox</Badge>
          </div>
        ) : null}
      </div>

      <div className="card">
        <div className="filters">
          <SearchInput value={query} onChange={setQuery} placeholder="Search company, role, notes…" />
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            <option value="all">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {(status !== 'all' || query) ? (
            <button className="btn btn-sm btn-ghost" onClick={() => { setStatus('all'); setQuery('') }}>Clear</button>
          ) : null}
        </div>

        {store.applications.length === 0 ? (
          <Empty
            icon="briefcase"
            title="No applications logged yet"
            text="When you submit a real application, add it here with the source, referral and follow-up date. Week 7 targets five tailored applications."
            action={<button className="btn btn-outline" onClick={openAdd}>Add your first application</button>}
          />
        ) : filtered.length === 0 ? (
          <Empty icon="search" title="No applications match" text="Adjust the search or status filter." />
        ) : (
          <div className="grid grid-2">
            {filtered.map((a) => (
              <article className="app-card" key={a.id}>
                <div className="app-top">
                  <div style={{ minWidth: 0 }}>
                    <div className="app-company">{a.company}</div>
                    <div className="app-role">{a.role}</div>
                  </div>
                  <select
                    className="select"
                    style={{ width: 122, padding: '4px 24px 4px 8px', fontSize: 11.5 }}
                    value={a.status}
                    onChange={(e) => actions.updateApplication(a.id, { status: e.target.value as ApplicationStatus })}
                    aria-label={`Status for ${a.company}`}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="app-meta">
                  {a.location ? <span><Icon name="mapPin" size={12} /> {a.location}</span> : null}
                  {a.compensation ? <span><Icon name="chart" size={12} /> {a.compensation}</span> : null}
                  {a.source ? <span><Icon name="link" size={12} /> {a.source}</span> : null}
                  {a.dateApplied ? <span><Icon name="calendar" size={12} /> Applied {formatDate(a.dateApplied)}</span> : null}
                </div>

                {a.referral ? (
                  <div className="row mt-1" style={{ gap: 6 }}>
                    <Badge tone="teal">Referral</Badge>
                    <span className="tiny subtle">{a.referral}</span>
                  </div>
                ) : null}

                {a.followUpDate ? (
                  <div className="row mt-1" style={{ gap: 6 }}>
                    <Badge tone={a.followUpDate <= todayISO() ? 'amber' : 'slate'} dot>Follow-up {relativeLabel(a.followUpDate)}</Badge>
                    <span className="tiny subtle">{formatDate(a.followUpDate)}</span>
                  </div>
                ) : null}

                {a.notes ? <div className="app-notes">{a.notes}</div> : null}

                <div className="row mt-2" style={{ gap: 6, justifyContent: 'flex-end' }}>
                  {a.url ? (
                    <a className="btn btn-xs btn-outline" href={a.url} target="_blank" rel="noreferrer">
                      <Icon name="external" size={11} /> Job post
                    </a>
                  ) : null}
                  <button className="btn btn-xs btn-outline" onClick={() => openEdit(a)}>Edit</button>
                  <button className="btn btn-xs btn-ghost" onClick={() => actions.removeApplication(a.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ background: 'linear-gradient(120deg,#fff,#f6f8ff)' }}>
        <div className="row" style={{ gap: 12 }}>
          <div className="stat-icon" style={{ background: 'var(--amber-soft)', color: 'var(--amber-ink)' }}>
            <Icon name="alert" size={17} />
          </div>
          <div>
            <div className="card-title">A healthy pipeline, not a fantasy pipeline</div>
            <div className="card-sub">
              Five targeted, well-matched applications beat fifty generic ones. Track real responses only, and use the
              notes field to record what you learned from each conversation.
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? 'Edit application' : 'Add application'}
        subtitle="Only log applications you have actually submitted or are genuinely pursuing."
        wide
        footer={
          <>
            {editingId ? (
              <button className="btn btn-danger" onClick={() => { actions.removeApplication(editingId); setOpen(false) }}>
                <Icon name="trash" size={14} /> Delete
              </button>
            ) : null}
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={save} disabled={!form.company.trim() || !form.role.trim()}>
              {editingId ? 'Save changes' : 'Add application'}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="field">
            <label className="label">Company</label>
            <input className="input" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Company name" />
          </div>
          <div className="field">
            <label className="label">Role</label>
            <input className="input" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Full-Stack Developer" />
          </div>
          <div className="field full">
            <label className="label">Job URL</label>
            <input className="input" value={form.url} onChange={(e) => set('url', e.target.value)} placeholder="https://…" />
          </div>
          <div className="field">
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Bengaluru / Remote" />
          </div>
          <div className="field">
            <label className="label">Compensation range</label>
            <input className="input" value={form.compensation} onChange={(e) => set('compensation', e.target.value)} placeholder="₹14–18 LPA" />
          </div>
          <div className="field">
            <label className="label">Date applied</label>
            <input className="input" type="date" value={form.dateApplied} onChange={(e) => set('dateApplied', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Status</label>
            <select className="select" value={form.status} onChange={(e) => set('status', e.target.value as ApplicationStatus)}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="label">Application source</label>
            <input className="input" value={form.source} onChange={(e) => set('source', e.target.value)} placeholder="LinkedIn, referral, careers page…" />
          </div>
          <div className="field">
            <label className="label">Referral contact</label>
            <input className="input" value={form.referral} onChange={(e) => set('referral', e.target.value)} placeholder="Name / relationship" />
          </div>
          <div className="field">
            <label className="label">Next follow-up date</label>
            <input className="input" type="date" value={form.followUpDate} onChange={(e) => set('followUpDate', e.target.value)} />
          </div>
          <div className="field full">
            <label className="label">Notes</label>
            <textarea className="textarea" style={{ minHeight: 64 }} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Recruiter, process, next step…" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
