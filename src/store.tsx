import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type {
  ApplicationStatus,
  Contact,
  DayState,
  DsaProblem,
  JobApplication,
  MilestoneState,
  MockQuestion,
  NoteEntry,
  ResearchCompany,
  Store,
  TopicState,
} from './types'
import { dailyPlan, weeks } from './data/plan'
import { seedDsa } from './data/dsa'
import { seedTopics } from './data/interview'
import { seedMilestones } from './data/portfolio'
import { seedEvent, seedGoals } from './data/event'
import { currentDayNumber, currentWeekNumber, daysUntilEvent, EVENT_DATE, PROGRAM_DAYS, todayISO } from './lib/date'

const STORAGE_KEY = 'ghci-2027-tracker:v1'
const VERSION = 1

export function uid(prefix = 'id'): string {
  const c = globalThis.crypto as Crypto | undefined
  if (c && 'randomUUID' in c) return `${prefix}-${c.randomUUID()}`
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function createInitialStore(): Store {
  const days: Record<string, DayState> = {}
  for (const d of dailyPlan) days[d.day] = { done: false, notes: '' }
  return {
    version: VERSION,
    days,
    dsa: seedDsa(),
    topics: seedTopics(),
    milestones: seedMilestones(),
    applications: [],
    contacts: [],
    research: [],
    event: seedEvent(),
    eventNotes: {},
    goals: seedGoals(),
    notes: [],
    mockQuestions: [],
    profile: {
      name: 'Ayush',
      headline: 'Full-Stack Engineer · React · Node · Go',
      targetRole: 'Full-Stack Developer (React.js + Node.js)',
      targetComp: '₹14–18 LPA',
    },
  }
}

function mergeMilestones(
  base: Store['milestones'],
  stored: Partial<Record<string, MilestoneState>> | undefined,
): Store['milestones'] {
  const out: Store['milestones'] = {}
  for (const [id, b] of Object.entries(base)) {
    const s = stored?.[id]
    out[id] = {
      status: s?.status ?? b.status,
      notes: s?.notes ?? b.notes,
      tasks: { ...b.tasks, ...(s?.tasks ?? {}) },
    }
  }
  return out
}

function mergeTopics(
  base: Store['topics'],
  stored: Partial<Record<string, TopicState>> | undefined,
): Store['topics'] {
  const out: Store['topics'] = {}
  for (const [id, b] of Object.entries(base)) {
    const s = stored?.[id]
    out[id] = {
      status: s?.status ?? b.status,
      confidence: s?.confidence ?? b.confidence,
      notes: s?.notes ?? b.notes,
      example: s?.example ?? b.example,
      revisionDate: s?.revisionDate ?? b.revisionDate,
    }
  }
  return out
}

function loadStore(): Store {
  const base = createInitialStore()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const parsed = JSON.parse(raw) as Partial<Store>
    return {
      ...base,
      ...parsed,
      version: VERSION,
      days: { ...base.days, ...(parsed.days ?? {}) },
      topics: mergeTopics(base.topics, parsed.topics),
      milestones: mergeMilestones(base.milestones, parsed.milestones),
      applications: Array.isArray(parsed.applications) ? parsed.applications : base.applications,
      contacts: Array.isArray(parsed.contacts) ? parsed.contacts : base.contacts,
      research: Array.isArray(parsed.research) ? parsed.research : base.research,
      notes: Array.isArray(parsed.notes) ? parsed.notes : base.notes,
      mockQuestions: Array.isArray(parsed.mockQuestions) ? parsed.mockQuestions : base.mockQuestions,
      dsa: Array.isArray(parsed.dsa) ? parsed.dsa : base.dsa,
      event: { ...base.event, ...(parsed.event ?? {}) },
      eventNotes: { ...base.eventNotes, ...(parsed.eventNotes ?? {}) },
      goals: { ...base.goals, ...(parsed.goals ?? {}) },
      profile: { ...base.profile, ...(parsed.profile ?? {}) },
    }
  } catch {
    return base
  }
}

type Actions = {
  toggleDay: (day: number) => void
  setDayNotes: (day: number, notes: string) => void
  addDsa: (p: Omit<DsaProblem, 'id'>) => void
  updateDsa: (id: string, patch: Partial<DsaProblem>) => void
  removeDsa: (id: string) => void
  updateTopic: (id: string, patch: Partial<TopicState>) => void
  updateMilestone: (id: string, patch: Partial<MilestoneState>) => void
  toggleMilestoneTask: (id: string, taskId: string) => void
  addApplication: (a: Omit<JobApplication, 'id'>) => void
  updateApplication: (id: string, patch: Partial<JobApplication>) => void
  removeApplication: (id: string) => void
  addContact: (c: Omit<Contact, 'id'>) => void
  updateContact: (id: string, patch: Partial<Contact>) => void
  removeContact: (id: string) => void
  addResearch: (r: Omit<ResearchCompany, 'id'>) => void
  updateResearch: (id: string, patch: Partial<ResearchCompany>) => void
  removeResearch: (id: string) => void
  toggleEvent: (id: string) => void
  setEventNote: (id: string, text: string) => void
  setGoal: (id: string, value: number) => void
  addNote: (n: Omit<NoteEntry, 'id'>) => void
  removeNote: (id: string) => void
  addMockQuestion: (q: Omit<MockQuestion, 'id'>) => void
  updateMockQuestion: (id: string, patch: Partial<MockQuestion>) => void
  removeMockQuestion: (id: string) => void
  setProfile: (patch: Partial<Store['profile']>) => void
  resetAll: () => void
  importStore: (data: Partial<Store>) => void
}

export type Metrics = {
  totalDays: number
  completedDays: number
  pendingDays: number
  overallPct: number
  currentDay: number
  currentWeek: number
  nextTask: (typeof dailyPlan)[number] | null
  todayPlan: (typeof dailyPlan)[number]
  todayDone: boolean
  dsaSolved: number
  dsaAttempted: number
  dsaRevision: number
  dsaTotal: number
  dsaPct: number
  topicsCompleted: number
  topicsLearning: number
  topicsTotal: number
  avgConfidence: number
  portfolioPct: number
  portfolioTasksDone: number
  portfolioTasksTotal: number
  applications: number
  assessments: number
  interviews: number
  rejections: number
  offers: number
  interviewRate: number
  conversations: number
  contactsTotal: number
  researchTotal: number
  researchDone: number
  daysToEvent: number
  weekly: { week: number; title: string; done: number; total: number; pct: number }[]
  eventDone: number
  eventTotal: number
  eventPct: number
  notesCount: number
  mockOpen: number
}

type Ctx = {
  store: Store
  actions: Actions
  metrics: Metrics
}

const StoreContext = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store>(loadStore)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    } catch {
      // storage may be full or blocked; the app still works in memory
    }
  }, [store])

  const patch = useCallback((fn: (s: Store) => Store) => setStore((s) => fn(s)), [])

  const actions = useMemo<Actions>(() => {
    return {
      toggleDay: (day) =>
        patch((s) => {
          const cur = s.days[day] ?? { done: false, notes: '' }
          const done = !cur.done
          return {
            ...s,
            days: {
              ...s.days,
              [day]: { ...cur, done, completedAt: done ? new Date().toISOString() : undefined },
            },
          }
        }),
      setDayNotes: (day, notes) =>
        patch((s) => ({
          ...s,
          days: { ...s.days, [day]: { ...(s.days[day] ?? { done: false, notes: '' }), notes } },
        })),
      addDsa: (p) => patch((s) => ({ ...s, dsa: [...s.dsa, { ...p, id: uid('dsa') }] })),
      updateDsa: (id, p) =>
        patch((s) => ({ ...s, dsa: s.dsa.map((d) => (d.id === id ? { ...d, ...p } : d)) })),
      removeDsa: (id) => patch((s) => ({ ...s, dsa: s.dsa.filter((d) => d.id !== id) })),
      updateTopic: (id, p) =>
        patch((s) => ({
          ...s,
          topics: { ...s.topics, [id]: { ...(s.topics[id] ?? { status: 'Not Started', confidence: 1, notes: '', example: '', revisionDate: '' }), ...p } },
        })),
      updateMilestone: (id, p) =>
        patch((s) => ({
          ...s,
          milestones: { ...s.milestones, [id]: { ...(s.milestones[id] ?? { status: 'Not Started', notes: '', tasks: {} }), ...p } },
        })),
      toggleMilestoneTask: (id, taskId) =>
        patch((s) => {
          const cur = s.milestones[id] ?? { status: 'Not Started', notes: '', tasks: {} }
          return {
            ...s,
            milestones: {
              ...s.milestones,
              [id]: { ...cur, tasks: { ...cur.tasks, [taskId]: !cur.tasks[taskId] } },
            },
          }
        }),
      addApplication: (a) =>
        patch((s) => ({ ...s, applications: [{ ...a, id: uid('app') }, ...s.applications] })),
      updateApplication: (id, p) =>
        patch((s) => ({
          ...s,
          applications: s.applications.map((a) => (a.id === id ? { ...a, ...p } : a)),
        })),
      removeApplication: (id) =>
        patch((s) => ({ ...s, applications: s.applications.filter((a) => a.id !== id) })),
      addContact: (c) =>
        patch((s) => ({ ...s, contacts: [{ ...c, id: uid('contact') }, ...s.contacts] })),
      updateContact: (id, p) =>
        patch((s) => ({
          ...s,
          contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...p } : c)),
        })),
      removeContact: (id) =>
        patch((s) => ({ ...s, contacts: s.contacts.filter((c) => c.id !== id) })),
      addResearch: (r) =>
        patch((s) => ({ ...s, research: [{ ...r, id: uid('research') }, ...s.research] })),
      updateResearch: (id, p) =>
        patch((s) => ({
          ...s,
          research: s.research.map((r) => (r.id === id ? { ...r, ...p } : r)),
        })),
      removeResearch: (id) =>
        patch((s) => ({ ...s, research: s.research.filter((r) => r.id !== id) })),
      toggleEvent: (id) => patch((s) => ({ ...s, event: { ...s.event, [id]: !s.event[id] } })),
      setEventNote: (id, text) =>
        patch((s) => ({ ...s, eventNotes: { ...s.eventNotes, [id]: text } })),
      setGoal: (id, value) =>
        patch((s) => ({ ...s, goals: { ...s.goals, [id]: Math.max(0, value) } })),
      addNote: (n) => patch((s) => ({ ...s, notes: [{ ...n, id: uid('note') }, ...s.notes] })),
      removeNote: (id) => patch((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),
      addMockQuestion: (q) =>
        patch((s) => ({ ...s, mockQuestions: [{ ...q, id: uid('mock') }, ...s.mockQuestions] })),
      updateMockQuestion: (id, p) =>
        patch((s) => ({
          ...s,
          mockQuestions: s.mockQuestions.map((q) => (q.id === id ? { ...q, ...p } : q)),
        })),
      removeMockQuestion: (id) =>
        patch((s) => ({ ...s, mockQuestions: s.mockQuestions.filter((q) => q.id !== id) })),
      setProfile: (p) => patch((s) => ({ ...s, profile: { ...s.profile, ...p } })),
      resetAll: () => setStore(createInitialStore()),
      importStore: (data) =>
        setStore(() => {
          const base = createInitialStore()
          return {
            ...base,
            ...data,
            version: VERSION,
            days: { ...base.days, ...(data.days ?? {}) },
            topics: mergeTopics(base.topics, data.topics),
            milestones: mergeMilestones(base.milestones, data.milestones),
            event: { ...base.event, ...(data.event ?? {}) },
            eventNotes: { ...base.eventNotes, ...(data.eventNotes ?? {}) },
            goals: { ...base.goals, ...(data.goals ?? {}) },
            profile: { ...base.profile, ...(data.profile ?? {}) },
            dsa: Array.isArray(data.dsa) ? data.dsa : base.dsa,
            applications: Array.isArray(data.applications) ? data.applications : base.applications,
            contacts: Array.isArray(data.contacts) ? data.contacts : base.contacts,
            research: Array.isArray(data.research) ? data.research : base.research,
            notes: Array.isArray(data.notes) ? data.notes : base.notes,
            mockQuestions: Array.isArray(data.mockQuestions) ? data.mockQuestions : base.mockQuestions,
          }
        }),
    }
  }, [patch])

  const metrics = useMemo<Metrics>(() => {
    const completedDays = Object.values(store.days).filter((d) => d.done).length
    const totalDays = dailyPlan.length
    const currentDay = currentDayNumber()
    const currentWeek = currentWeekNumber()
    const todayPlan = dailyPlan.find((d) => d.day === currentDay) ?? dailyPlan[0]
    const nextTask =
      dailyPlan.find((d) => !store.days[d.day]?.done) ?? null

    const dsaSolved = store.dsa.filter((d) => d.status === 'Solved').length
    const dsaAttempted = store.dsa.filter((d) => d.status === 'Attempted').length
    const dsaRevision = store.dsa.filter((d) => d.status === 'Needs Revision').length

    const topics = Object.values(store.topics)
    const topicsCompleted = topics.filter((t) => t.status === 'Completed').length
    const topicsLearning = topics.filter((t) => t.status === 'Learning').length
    const avgConfidence = topics.length
      ? topics.reduce((sum, t) => sum + (t.confidence || 0), 0) / topics.length
      : 0

    const milestoneStates = Object.values(store.milestones)
    let portfolioTasksTotal = 0
    let portfolioTasksDone = 0
    for (const m of milestoneStates) {
      const vals = Object.values(m.tasks)
      portfolioTasksTotal += vals.length
      portfolioTasksDone += vals.filter(Boolean).length
    }

    const applications = store.applications.length
    const countStatus = (s: ApplicationStatus) => store.applications.filter((a) => a.status === s).length
    const assessments = countStatus('Assessment')
    const interviews = store.applications.filter((a) => a.status === 'Interview' || a.status === 'Offer').length
    const rejections = countStatus('Rejected')
    const offers = countStatus('Offer')
    const interviewRate = applications ? Math.round((interviews / applications) * 100) : 0

    const conversations = store.contacts.filter(
      (c) =>
        c.conversationDate ||
        ['Conversation', 'Follow-up Sent', 'Replied', 'Opportunity'].includes(c.status),
    ).length

    const weekly = weeks.map((w) => {
      const days = dailyPlan.filter((d) => d.week === w.week)
      const done = days.filter((d) => store.days[d.day]?.done).length
      return {
        week: w.week,
        title: w.title,
        done,
        total: days.length,
        pct: Math.round((done / days.length) * 100),
      }
    })

    const eventValues = Object.values(store.event)
    const eventDone = eventValues.filter(Boolean).length
    const eventTotal = eventValues.length

    return {
      totalDays,
      completedDays,
      pendingDays: totalDays - completedDays,
      overallPct: Math.round((completedDays / totalDays) * 100),
      currentDay,
      currentWeek,
      nextTask,
      todayPlan,
      todayDone: Boolean(store.days[todayPlan.day]?.done),
      dsaSolved,
      dsaAttempted,
      dsaRevision,
      dsaTotal: store.dsa.length,
      dsaPct: store.dsa.length ? Math.round((dsaSolved / store.dsa.length) * 100) : 0,
      topicsCompleted,
      topicsLearning,
      topicsTotal: topics.length,
      avgConfidence: Math.round(avgConfidence * 10) / 10,
      portfolioPct: portfolioTasksTotal
        ? Math.round((portfolioTasksDone / portfolioTasksTotal) * 100)
        : 0,
      portfolioTasksDone,
      portfolioTasksTotal,
      applications,
      assessments,
      interviews,
      rejections,
      offers,
      interviewRate,
      conversations,
      contactsTotal: store.contacts.length,
      researchTotal: store.research.length,
      researchDone: store.research.filter((r) => r.researched).length,
      daysToEvent: daysUntilEvent(),
      weekly,
      eventDone,
      eventTotal,
      eventPct: eventTotal ? Math.round((eventDone / eventTotal) * 100) : 0,
      notesCount: store.notes.length,
      mockOpen: store.mockQuestions.filter((q) => !q.resolved).length,
    }
  }, [store])

  return (
    <StoreContext.Provider value={{ store, actions, metrics }}>{children}</StoreContext.Provider>
  )
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

export const STORAGE_KEY_EXPORT = STORAGE_KEY
export const EVENT_ISO = EVENT_DATE
export const PROGRAM_TOTAL_DAYS = PROGRAM_DAYS
export const today = todayISO
