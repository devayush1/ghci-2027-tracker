export type NavKey =
  | 'dashboard'
  | 'roadmap'
  | 'daily'
  | 'dsa'
  | 'interview'
  | 'portfolio'
  | 'applications'
  | 'networking'
  | 'event'
  | 'notes'

export type DayPlan = {
  id: string
  day: number
  date: string
  week: number
  title: string
  topic: string
  tasks: string[]
  deliverable: string
}

export type WeekPlan = {
  week: number
  title: string
  range: string
  objective: string
  focus: string[]
  deliverables: string[]
  accent: string
}

export type DayState = {
  done: boolean
  notes: string
  completedAt?: string
}

export type DsaStatus = 'Not Started' | 'Attempted' | 'Solved' | 'Needs Revision'
export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type DsaProblem = {
  id: string
  name: string
  topic: string
  difficulty: Difficulty
  platform: string
  link: string
  dateAttempted: string
  status: DsaStatus
  timeTaken: string
  notes: string
  solutionLink: string
}

export type TopicStatus = 'Not Started' | 'Learning' | 'Completed'

export type InterviewTopic = {
  id: string
  category: string
  title: string
  prompt: string
  example: string
}

export type TopicState = {
  status: TopicStatus
  confidence: number
  notes: string
  example: string
  revisionDate: string
}

export type MockQuestion = {
  id: string
  area: string
  question: string
  answer: string
  resolved: boolean
  date: string
}

export type MilestoneStatus = 'Not Started' | 'In Progress' | 'Complete'

export type MilestoneTask = {
  id: string
  label: string
}

export type Milestone = {
  id: string
  title: string
  description: string
  tasks: MilestoneTask[]
}

export type MilestoneState = {
  status: MilestoneStatus
  notes: string
  tasks: Record<string, boolean>
}

export type ApplicationStatus =
  | 'Interested'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Rejected'
  | 'Offer'

export type JobApplication = {
  id: string
  company: string
  role: string
  url: string
  location: string
  compensation: string
  dateApplied: string
  source: string
  referral: string
  status: ApplicationStatus
  followUpDate: string
  notes: string
}

export type ConnectionStatus =
  | 'To Contact'
  | 'Requested'
  | 'Connected'
  | 'Conversation'
  | 'Follow-up Sent'
  | 'Replied'
  | 'Opportunity'

export type Contact = {
  id: string
  name: string
  company: string
  designation: string
  linkedin: string
  conversationDate: string
  notes: string
  opportunity: string
  followUpRequired: boolean
  followUpDate: string
  status: ConnectionStatus
}

export type ResearchCompany = {
  id: string
  name: string
  why: string
  roles: string
  people: string
  notes: string
  researched: boolean
}

export type EventPhase = 'Before the event' | 'During the event' | 'After the event'

export type EventItem = {
  id: string
  phase: EventPhase
  label: string
  hint: string
}

export type NetworkingGoal = {
  id: string
  label: string
  target: number
}

export type NoteCategory =
  | 'Reflection'
  | 'Mock Interview'
  | 'Learning'
  | 'Follow-up'
  | 'Idea'

export type NoteEntry = {
  id: string
  date: string
  category: NoteCategory
  title: string
  body: string
}

export type Store = {
  version: number
  days: Record<string, DayState>
  dsa: DsaProblem[]
  topics: Record<string, TopicState>
  milestones: Record<string, MilestoneState>
  applications: JobApplication[]
  contacts: Contact[]
  research: ResearchCompany[]
  event: Record<string, boolean>
  eventNotes: Record<string, string>
  goals: Record<string, number>
  notes: NoteEntry[]
  mockQuestions: MockQuestion[]
  profile: {
    name: string
    headline: string
    targetRole: string
    targetComp: string
  }
}
