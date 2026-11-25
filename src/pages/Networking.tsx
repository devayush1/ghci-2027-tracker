import React, { useMemo, useState } from 'react'
import { useStore } from '../store'
import type { ConnectionStatus, Contact, ResearchCompany } from '../types'
import { Badge, Empty, Modal, SearchInput, Stat, Tabs } from '../components/ui'
import { Icon } from '../components/Icon'
import { formatDate, relativeLabel, todayISO } from '../lib/date'

const statuses: ConnectionStatus[] = [
  'To Contact',
  'Requested',
  'Connected',
  'Conversation',
  'Follow-up Sent',
  'Replied',
  'Opportunity',
]

function statusTone(s: ConnectionStatus) {
  if (s === 'Opportunity') return 'green' as const
  if (s === 'Replied' || s === 'Conversation') return 'indigo' as const
  if (s === 'Follow-up Sent') return 'amber' as const
  if (s === 'Connected' || s === 'Requested') return 'sky' as const
  return 'slate' as const
}

const emptyContact = (): Omit<Contact, 'id'> => ({
  name: '',
  company: '',
  designation: '',
  linkedin: '',
  conversationDate: '',
  notes: '',
  opportunity: '',
  followUpRequired: false,
  followUpDate: '',
  status: 'To Contact',
})

const emptyResearch = (): Omit<ResearchCompany, 'id'> => ({
  name: '',
  why: '',
  roles: '',
  people: '',
  notes: '',
  researched: false,
})

type Tab = 'contacts' | 'research'

export function Networking() {
  const { store, actions, metrics } = useStore()
  const [tab, setTab] = useState<Tab>('contacts')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [contactOpen, setContactOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<string | null>(null)
  const [contactForm, setContactForm] = useState<Omit<Contact, 'id'>>(emptyContact)
  const [researchOpen, setResearchOpen] = useState(false)
  const [editingResearch, setEditingResearch] = useState<string | null>(null)
  const [researchForm, setResearchForm] = useState<Omit<ResearchCompany, 'id'>>(emptyResearch)

  const filteredContacts = useMemo(() => {
    return store.contacts.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        if (!`${c.name} ${c.company} ${c.designation} ${c.notes} ${c.opportunity}`.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [store.contacts, statusFilter, query])

  const followUpsDue = store.contacts.filter(
    (c) => c.followUpRequired && c.followUpDate && c.followUpDate <= todayISO(),
  )

  const openAddContact = () => {
    setEditingContact(null)
    setContactForm(emptyContact())
    setContactOpen(true)
  }
  const openEditContact = (c: Contact) => {
    setEditingContact(c.id)
    const { id, ...rest } = c
    setContactForm(rest)
    setContactOpen(true)
  }
  const saveContact = () => {
    if (!contactForm.name.trim()) return
    if (editingContact) actions.updateContact(editingContact, contactForm)
    else actions.addContact(contactForm)
    setContactOpen(false)
  }
  const setC = <K extends keyof Omit<Contact, 'id'>>(key: K, value: Omit<Contact, 'id'>[K]) =>
    setContactForm((f) => ({ ...f, [key]: value }))

  const openAddResearch = () => {
    setEditingResearch(null)
    setResearchForm(emptyResearch())
    setResearchOpen(true)
  }
  const openEditResearch = (r: ResearchCompany) => {
    setEditingResearch(r.id)
    const { id, ...rest } = r
    setResearchForm(rest)
    setResearchOpen(true)
  }
  const saveResearch = () => {
    if (!researchForm.name.trim()) return
    if (editingResearch) actions.updateResearch(editingResearch, researchForm)
    else actions.addResearch(researchForm)
    setResearchOpen(false)
  }
  const setR = <K extends keyof Omit<ResearchCompany, 'id'>>(key: K, value: Omit<ResearchCompany, 'id'>[K]) =>
    setResearchForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="stack">
      <div className="page-intro">
        <div>
          <div className="eyebrow">GHCI networking CRM</div>
          <h1 className="h1">Networking & recruiter tracker</h1>
          <p>
            Treat networking like engineering: capture context, follow up deliberately and never fabricate a
            conversation. The goal is five meaningful conversations at GHCI, not a pile of business cards.
          </p>
        </div>
        <div className="row wrap">
          <button className="btn btn-outline" onClick={openAddResearch}>
            <Icon name="building" size={15} /> Add company
          </button>
          <button className="btn btn-primary" onClick={openAddContact}>
            <Icon name="plus" size={15} /> Add contact
          </button>
        </div>
      </div>

      <div className="grid grid-4">
        <Stat label="Contacts tracked" value={metrics.contactsTotal} icon="users" tone="indigo" foot={<span>{metrics.conversations} with real conversations</span>} />
        <Stat label="Follow-ups due" value={followUpsDue.length} icon="mail" tone={followUpsDue.length ? 'amber' : 'green'} foot={<span>Within 24–48h of meeting</span>} />
        <Stat label="Opportunities" value={store.contacts.filter((c) => c.status === 'Opportunity').length} icon="target" tone="green" foot={<span>Genuine role leads only</span>} />
        <Stat label="Companies researched" value={<>{metrics.researchDone}<small>/ {metrics.researchTotal || 0}</small></>} icon="building" tone="teal" foot={<span>Six priority targets for GHCI</span>} />
      </div>

      {followUpsDue.length > 0 ? (
        <div className="next-action">
          <div className="na-left">
            <div className="na-icon" style={{ background: 'linear-gradient(140deg,#f59e0b,#f97316)' }}>
              <Icon name="mail" size={18} />
            </div>
            <div>
              <div className="na-title">{followUpsDue.length} networking follow-up{followUpsDue.length > 1 ? 's' : ''} due</div>
              <div className="na-sub">{followUpsDue.map((c) => `${c.name} (${c.company})`).join(' · ')}</div>
            </div>
          </div>
          <Badge tone="amber">Send a personalised note</Badge>
        </div>
      ) : null}

      <div className="row-between wrap" style={{ gap: 12 }}>
        <Tabs<Tab>
          items={[
            { key: 'contacts', label: 'Contacts CRM', count: store.contacts.length },
            { key: 'research', label: 'Company research', count: store.research.length },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {tab === 'contacts' ? (
        <div className="card">
          <div className="filters">
            <SearchInput value={query} onChange={setQuery} placeholder="Search name, company, notes…" />
            <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by connection status">
              <option value="all">All statuses</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {(statusFilter !== 'all' || query) ? (
              <button className="btn btn-sm btn-ghost" onClick={() => { setStatusFilter('all'); setQuery('') }}>Clear</button>
            ) : null}
          </div>

          {store.contacts.length === 0 ? (
            <Empty
              icon="users"
              title="Your networking CRM is empty"
              text="Add engineers, recruiters and founders you meet or plan to meet. Record the context, the advice and the follow-up — not just the name."
              action={<button className="btn btn-outline" onClick={openAddContact}>Add your first contact</button>}
            />
          ) : filteredContacts.length === 0 ? (
            <Empty icon="search" title="No contacts match" text="Adjust the search or status filter." />
          ) : (
            <div className="grid grid-2">
              {filteredContacts.map((c) => (
                <article className="app-card" key={c.id}>
                  <div className="app-top">
                    <div style={{ minWidth: 0 }}>
                      <div className="app-company">{c.name}</div>
                      <div className="app-role">{c.designation}{c.designation && c.company ? ' · ' : ''}{c.company}</div>
                    </div>
                    <select
                      className="select"
                      style={{ width: 130, padding: '4px 24px 4px 8px', fontSize: 11.5 }}
                      value={c.status}
                      onChange={(e) => actions.updateContact(c.id, { status: e.target.value as ConnectionStatus })}
                      aria-label={`Connection status for ${c.name}`}
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="app-meta">
                    {c.conversationDate ? <span><Icon name="calendar" size={12} /> Met {formatDate(c.conversationDate)}</span> : <span><Icon name="calendar" size={12} /> Not met yet</span>}
                    {c.linkedin ? (
                      <a href={c.linkedin} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Icon name="linkedin" size={12} /> LinkedIn
                      </a>
                    ) : null}
                  </div>

                  {c.opportunity ? (
                    <div className="mt-1">
                      <Badge tone="teal" dot>Opportunity / advice</Badge>
                      <div className="small mt-1" style={{ color: 'var(--ink-2)' }}>{c.opportunity}</div>
                    </div>
                  ) : null}

                  {c.notes ? <div className="app-notes">{c.notes}</div> : null}

                  {c.followUpRequired ? (
                    <div className="row mt-2" style={{ gap: 6 }}>
                      <Badge tone={c.followUpDate && c.followUpDate <= todayISO() ? 'amber' : 'slate'} dot>
                        Follow-up {c.followUpDate ? relativeLabel(c.followUpDate) : 'needed'}
                      </Badge>
                      {c.followUpDate ? <span className="tiny subtle">{formatDate(c.followUpDate)}</span> : null}
                    </div>
                  ) : null}

                  <div className="row mt-2" style={{ gap: 6, justifyContent: 'flex-end' }}>
                    <button className="btn btn-xs btn-outline" onClick={() => openEditContact(c)}>Edit</button>
                    <button className="btn btn-xs btn-ghost" onClick={() => actions.removeContact(c.id)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Companies to research before GHCI</div>
              <div className="card-sub">Stack, teams, culture and the people you want to meet</div>
            </div>
            <Badge tone="teal">{metrics.researchDone}/{metrics.researchTotal || 0} researched</Badge>
          </div>

          {store.research.length === 0 ? (
            <Empty
              icon="building"
              title="No companies researched yet"
              text="Add 12–15 companies, then shortlist six priorities. For each, note why they matter, the roles you want and the people to meet."
              action={<button className="btn btn-outline" onClick={openAddResearch}>Add a company</button>}
            />
          ) : (
            <div className="grid grid-2">
              {store.research.map((r) => (
                <article className="app-card" key={r.id}>
                  <div className="app-top">
                    <div style={{ minWidth: 0 }}>
                      <div className="app-company">{r.name}</div>
                      {r.roles ? <div className="app-role">{r.roles}</div> : null}
                    </div>
                    <Badge tone={r.researched ? 'green' : 'slate'} dot>{r.researched ? 'Researched' : 'To research'}</Badge>
                  </div>

                  {r.why ? (
                    <div className="mt-2">
                      <div className="tiny subtle" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Why</div>
                      <div className="small" style={{ color: 'var(--ink-2)' }}>{r.why}</div>
                    </div>
                  ) : null}
                  {r.people ? (
                    <div className="mt-1">
                      <div className="tiny subtle" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>People to meet</div>
                      <div className="small" style={{ color: 'var(--ink-2)' }}>{r.people}</div>
                    </div>
                  ) : null}
                  {r.notes ? <div className="app-notes">{r.notes}</div> : null}

                  <div className="row mt-2" style={{ gap: 6, justifyContent: 'flex-end' }}>
                    <button className="btn btn-xs btn-outline" onClick={() => actions.updateResearch(r.id, { researched: !r.researched })}>
                      {r.researched ? 'Mark unresearched' : 'Mark researched'}
                    </button>
                    <button className="btn btn-xs btn-outline" onClick={() => openEditResearch(r)}>Edit</button>
                    <button className="btn btn-xs btn-ghost" onClick={() => actions.removeResearch(r.id)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ background: 'linear-gradient(120deg,#fff,#f5fbfa)' }}>
        <div className="row" style={{ gap: 12 }}>
          <div className="stat-icon" style={{ background: 'var(--teal-soft)', color: 'var(--teal-ink)' }}>
            <Icon name="users" size={17} />
          </div>
          <div>
            <div className="card-title">Suggested GHCI networking goals</div>
            <div className="card-sub">
              5 meaningful company/recruiter/engineer conversations · 15 relevant professional connections · 3
              potential role leads · 5 personalised follow-ups. Quality of conversation matters more than the count.
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title={editingContact ? 'Edit contact' : 'Add contact'}
        subtitle="Capture the context while it is fresh. Never log a conversation that did not happen."
        wide
        footer={
          <>
            {editingContact ? (
              <button className="btn btn-danger" onClick={() => { actions.removeContact(editingContact); setContactOpen(false) }}>
                <Icon name="trash" size={14} /> Delete
              </button>
            ) : null}
            <button className="btn btn-ghost" onClick={() => setContactOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveContact} disabled={!contactForm.name.trim()}>
              {editingContact ? 'Save changes' : 'Add contact'}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="field">
            <label className="label">Name</label>
            <input className="input" value={contactForm.name} onChange={(e) => setC('name', e.target.value)} placeholder="Full name" />
          </div>
          <div className="field">
            <label className="label">Company</label>
            <input className="input" value={contactForm.company} onChange={(e) => setC('company', e.target.value)} placeholder="Company" />
          </div>
          <div className="field">
            <label className="label">Designation</label>
            <input className="input" value={contactForm.designation} onChange={(e) => setC('designation', e.target.value)} placeholder="Engineering Manager, Recruiter…" />
          </div>
          <div className="field">
            <label className="label">LinkedIn URL</label>
            <input className="input" value={contactForm.linkedin} onChange={(e) => setC('linkedin', e.target.value)} placeholder="https://linkedin.com/in/…" />
          </div>
          <div className="field">
            <label className="label">Conversation date</label>
            <input className="input" type="date" value={contactForm.conversationDate} onChange={(e) => setC('conversationDate', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Connection status</label>
            <select className="select" value={contactForm.status} onChange={(e) => setC('status', e.target.value as ConnectionStatus)}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="field full">
            <label className="label">Discussion notes</label>
            <textarea className="textarea" value={contactForm.notes} onChange={(e) => setC('notes', e.target.value)} placeholder="What did you discuss? What did they care about?" />
          </div>
          <div className="field full">
            <label className="label">Opportunity or advice received</label>
            <textarea className="textarea" style={{ minHeight: 62 }} value={contactForm.opportunity} onChange={(e) => setC('opportunity', e.target.value)} placeholder="Role lead, referral, advice, intro…" />
          </div>
          <div className="field">
            <label className="label">Follow-up required</label>
            <select className="select" value={contactForm.followUpRequired ? 'yes' : 'no'} onChange={(e) => setC('followUpRequired', e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div className="field">
            <label className="label">Follow-up date</label>
            <input className="input" type="date" value={contactForm.followUpDate} onChange={(e) => setC('followUpDate', e.target.value)} />
          </div>
        </div>
      </Modal>

      <Modal
        open={researchOpen}
        onClose={() => setResearchOpen(false)}
        title={editingResearch ? 'Edit company' : 'Add company'}
        subtitle="Research the engineering work, not just the careers page."
        wide
        footer={
          <>
            {editingResearch ? (
              <button className="btn btn-danger" onClick={() => { actions.removeResearch(editingResearch); setResearchOpen(false) }}>
                <Icon name="trash" size={14} /> Delete
              </button>
            ) : null}
            <button className="btn btn-ghost" onClick={() => setResearchOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveResearch} disabled={!researchForm.name.trim()}>
              {editingResearch ? 'Save changes' : 'Add company'}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="field">
            <label className="label">Company name</label>
            <input className="input" value={researchForm.name} onChange={(e) => setR('name', e.target.value)} placeholder="Company" />
          </div>
          <div className="field">
            <label className="label">Researched</label>
            <select className="select" value={researchForm.researched ? 'yes' : 'no'} onChange={(e) => setR('researched', e.target.value === 'yes')}>
              <option value="no">Not yet</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div className="field full">
            <label className="label">Why this company</label>
            <textarea className="textarea" style={{ minHeight: 62 }} value={researchForm.why} onChange={(e) => setR('why', e.target.value)} placeholder="Engineering culture, product, stack, growth…" />
          </div>
          <div className="field">
            <label className="label">Roles you want</label>
            <input className="input" value={researchForm.roles} onChange={(e) => setR('roles', e.target.value)} placeholder="Full-Stack Developer, SDE 2…" />
          </div>
          <div className="field">
            <label className="label">People to meet</label>
            <input className="input" value={researchForm.people} onChange={(e) => setR('people', e.target.value)} placeholder="Names / teams" />
          </div>
          <div className="field full">
            <label className="label">Research notes</label>
            <textarea className="textarea" value={researchForm.notes} onChange={(e) => setR('notes', e.target.value)} placeholder="Recent launches, engineering blog, interview process, questions to ask…" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
