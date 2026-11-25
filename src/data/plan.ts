import type { DayPlan, WeekPlan } from '../types'

type RawDay = {
  day: number
  date: string
  week: number
  title: string
  tasks: string[]
  deliverable: string
}

const rawDays: RawDay[] = [
  // ---------------- WEEK 1 ----------------
  {
    day: 1,
    date: '2026-11-26',
    week: 1,
    title: 'Career baseline',
    tasks: [
      'Review 5 Full-Stack React + Node job descriptions.',
      'List repeated skills and gaps.',
      'Take a 30-minute JavaScript self-assessment.',
      'Write your target role in one sentence.',
    ],
    deliverable: 'Skills-gap list + baseline score.',
  },
  {
    day: 2,
    date: '2026-11-27',
    week: 1,
    title: 'Resume audit',
    tasks: [
      'Rewrite headline and summary for Full-Stack Engineer roles.',
      'Make experience bullets outcome-focused.',
      'Add technologies only where you actually used them.',
    ],
    deliverable: 'Resume draft v1.',
  },
  {
    day: 3,
    date: '2026-11-28',
    week: 1,
    title: 'Zeliot story 1',
    tasks: [
      'Document one significant feature or defect you owned.',
      'Explain the context and user/business problem.',
      'Document your decisions and implementation.',
      'Explain the result.',
      'Practise explaining it aloud.',
    ],
    deliverable: 'Project story 1.',
  },
  {
    day: 4,
    date: '2026-11-29',
    week: 1,
    title: 'Zeliot story 2',
    tasks: [
      'Document one backend/API or integration challenge.',
      'Include data flow, error handling, testing and trade-offs.',
      'Identify what you personally implemented.',
    ],
    deliverable: 'Project story 2.',
  },
  {
    day: 5,
    date: '2026-11-30',
    week: 1,
    title: 'Zeliot story 3',
    tasks: [
      'Document one performance, reliability or collaboration example.',
      'Prepare a clear architecture sketch.',
      'Include measurable impact if known.',
    ],
    deliverable: 'Project story 3.',
  },
  {
    day: 6,
    date: '2026-12-01',
    week: 1,
    title: 'JavaScript diagnostic',
    tasks: [
      'Revise scope, hoisting, closures, types, equality and functions.',
      'Solve 3 easy array/string problems without looking at solutions.',
    ],
    deliverable: 'List of weak JavaScript topics + 3 solutions.',
  },
  {
    day: 7,
    date: '2026-12-02',
    week: 1,
    title: 'Review & profile',
    tasks: [
      'Polish resume v1 and LinkedIn headline.',
      'Practise a 30-second introduction.',
      'Review the week.',
      'Plan any unfinished tasks.',
    ],
    deliverable: 'Updated LinkedIn + introduction pitch.',
  },

  // ---------------- WEEK 2 ----------------
  {
    day: 8,
    date: '2026-12-03',
    week: 2,
    title: 'Scope & closures',
    tasks: [
      'Study lexical scope.',
      'Understand execution context.',
      'Revise hoisting and closures.',
      'Write small examples from memory.',
      'Explain a closure using a practical analogy.',
    ],
    deliverable: '5 runnable JavaScript examples.',
  },
  {
    day: 9,
    date: '2026-12-04',
    week: 2,
    title: 'this & prototypes',
    tasks: [
      'Revise the this keyword.',
      'Understand call, apply and bind.',
      'Study the prototype chain.',
      'Revise classes and inheritance.',
      'Solve 2 output-prediction questions.',
    ],
    deliverable: 'Notes + 2 explained outputs.',
  },
  {
    day: 10,
    date: '2026-12-05',
    week: 2,
    title: 'Async JavaScript',
    tasks: [
      'Study callbacks and promises.',
      'Understand async/await.',
      'Revise error propagation.',
      'Study Promise combinators.',
      'Implement a retry helper.',
    ],
    deliverable: 'Retry helper + tests.',
  },
  {
    day: 11,
    date: '2026-12-06',
    week: 2,
    title: 'Event loop',
    tasks: [
      'Understand the call stack.',
      'Study task queue and microtasks.',
      'Understand timers and fetch.',
      'Predict execution order in 8 snippets.',
    ],
    deliverable: '8 explained event-loop answers.',
  },
  {
    day: 12,
    date: '2026-12-07',
    week: 2,
    title: 'Arrays & strings',
    tasks: [
      'Practise frequency maps.',
      'Practise two pointers.',
      'Practise sliding window.',
      'Solve 3 problems.',
      'State time and space complexity.',
    ],
    deliverable: '3 solved problems.',
  },
  {
    day: 13,
    date: '2026-12-08',
    week: 2,
    title: 'Hash maps & patterns',
    tasks: [
      'Solve 3 hash-map/set problems.',
      'Revisit any failed problem without viewing the solution.',
      'Write down the problem-solving pattern.',
    ],
    deliverable: '3 solved problems + pattern notes.',
  },
  {
    day: 14,
    date: '2026-12-09',
    week: 2,
    title: 'Review & mock',
    tasks: [
      'Take a 45-minute JavaScript quiz.',
      'Redo 2 DSA problems.',
      'Explain one concept aloud as if in an interview.',
    ],
    deliverable: 'Quiz score + top 3 gaps.',
  },

  // ---------------- WEEK 3 ----------------
  {
    day: 15,
    date: '2026-12-10',
    week: 3,
    title: 'Rendering model',
    tasks: [
      'Revise components and reconciliation.',
      'Understand keys.',
      'Study state updates and render cycles.',
      'Explain why a component re-renders.',
    ],
    deliverable: 'One-page rendering notes.',
  },
  {
    day: 16,
    date: '2026-12-11',
    week: 3,
    title: 'Hooks',
    tasks: [
      'Practise useState.',
      'Practise useEffect.',
      'Practise useRef.',
      'Practise useMemo and useCallback.',
      'Build examples showing dependency and cleanup behaviour.',
    ],
    deliverable: 'Hooks playground.',
  },
  {
    day: 17,
    date: '2026-12-12',
    week: 3,
    title: 'State architecture',
    tasks: [
      'Compare local state, Context and a state library.',
      'Build a small feature with clean state boundaries.',
    ],
    deliverable: 'Working state-managed feature.',
  },
  {
    day: 18,
    date: '2026-12-13',
    week: 3,
    title: 'Data fetching',
    tasks: [
      'Implement loading, empty, error and success states.',
      'Add cancellation or stale-response protection where appropriate.',
    ],
    deliverable: 'Robust data-fetching component.',
  },
  {
    day: 19,
    date: '2026-12-14',
    week: 3,
    title: 'Performance',
    tasks: [
      'Use React DevTools Profiler.',
      'Identify avoidable renders.',
      'Apply memoisation only where it helps.',
      'Review list rendering and code splitting.',
    ],
    deliverable: 'Before/after performance notes.',
  },
  {
    day: 20,
    date: '2026-12-15',
    week: 3,
    title: 'React app build',
    tasks: [
      'Build a responsive dashboard page.',
      'Create reusable components.',
      'Implement forms and validation.',
      'Add accessible controls.',
    ],
    deliverable: 'Functional dashboard page.',
  },
  {
    day: 21,
    date: '2026-12-16',
    week: 3,
    title: 'React interview review',
    tasks: [
      'Answer 15 React questions aloud.',
      'Review the dashboard code.',
      'Explain component boundaries and trade-offs.',
    ],
    deliverable: 'React Q&A notes + code cleanup.',
  },

  // ---------------- WEEK 4 ----------------
  {
    day: 22,
    date: '2026-12-17',
    week: 4,
    title: 'Node runtime',
    tasks: [
      'Revise the Node event loop.',
      'Understand libuv at a high level.',
      'Study asynchronous I/O.',
      'Revise streams and process lifecycle.',
      'Explain when CPU-heavy work blocks requests.',
    ],
    deliverable: 'Node runtime notes.',
  },
  {
    day: 23,
    date: '2026-12-18',
    week: 4,
    title: 'Express architecture',
    tasks: [
      'Build routes, controllers and services.',
      'Implement middleware.',
      'Add centralised error handling.',
      'Add request validation.',
    ],
    deliverable: 'Clean API skeleton.',
  },
  {
    day: 24,
    date: '2026-12-19',
    week: 4,
    title: 'Authentication',
    tasks: [
      'Implement password hashing.',
      'Implement JWT-based access flow.',
      'Understand refresh tokens and expiry.',
      'Study common security risks.',
    ],
    deliverable: 'Authentication flow.',
  },
  {
    day: 25,
    date: '2026-12-20',
    week: 4,
    title: 'API quality',
    tasks: [
      'Add pagination and filtering.',
      'Implement consistent response formats.',
      'Use appropriate status codes.',
      'Add validation.',
      'Write API tests.',
    ],
    deliverable: 'Tested CRUD endpoints.',
  },
  {
    day: 26,
    date: '2026-12-21',
    week: 4,
    title: 'Reliability & security',
    tasks: [
      'Add rate limiting.',
      'Implement structured logging.',
      'Configure environment variables.',
      'Add safe error responses.',
      'Review CORS and input handling.',
    ],
    deliverable: 'Security/reliability checklist.',
  },
  {
    day: 27,
    date: '2026-12-22',
    week: 4,
    title: 'Redis & background work',
    tasks: [
      'Implement a cache-aside example or a simple background job.',
      'Explain cache invalidation.',
      'Understand TTL.',
      'Review failure behaviour.',
    ],
    deliverable: 'Redis-backed feature.',
  },
  {
    day: 28,
    date: '2026-12-23',
    week: 4,
    title: 'Backend review',
    tasks: [
      'Walk through one request end-to-end.',
      'Run tests and fix defects.',
      'Practise 10 Node/API interview questions.',
    ],
    deliverable: 'API demo + review notes.',
  },

  // ---------------- WEEK 5 ----------------
  {
    day: 29,
    date: '2026-12-24',
    week: 5,
    title: 'SQL fundamentals',
    tasks: [
      'Practise joins and grouping.',
      'Study subqueries and constraints.',
      'Write queries for a realistic user/order schema.',
    ],
    deliverable: '8 SQL queries.',
  },
  {
    day: 30,
    date: '2026-12-25',
    week: 5,
    title: 'Indexes & transactions',
    tasks: [
      'Study indexes and query plans.',
      'Understand ACID.',
      'Revise isolation levels.',
      'Study common locking issues.',
      'Explain when an index can hurt writes.',
    ],
    deliverable: 'Index and transaction notes.',
  },
  {
    day: 31,
    date: '2026-12-26',
    week: 5,
    title: 'Redis patterns',
    tasks: [
      'Revise caching and TTL.',
      'Study cache invalidation.',
      'Practise counters.',
      'Revise Redis data structures.',
      'Identify cache failure scenarios.',
    ],
    deliverable: 'Redis use-case comparison.',
  },
  {
    day: 32,
    date: '2026-12-27',
    week: 5,
    title: 'System design method',
    tasks: [
      'Practise gathering requirements.',
      'Make capacity assumptions.',
      'Design APIs and data models.',
      'Identify components and trade-offs.',
      'Design a URL shortener.',
    ],
    deliverable: 'URL shortener design.',
  },
  {
    day: 33,
    date: '2026-12-28',
    week: 5,
    title: 'Rate limiter design',
    tasks: [
      'Design a rate limiter.',
      'Compare fixed window.',
      'Compare sliding window.',
      'Compare token bucket.',
      'Discuss distributed coordination.',
    ],
    deliverable: 'Rate limiter design.',
  },
  {
    day: 34,
    date: '2026-12-29',
    week: 5,
    title: 'Reliability design',
    tasks: [
      'Study queues and retries.',
      'Understand idempotency.',
      'Study dead-letter queues.',
      'Revise observability and graceful degradation.',
      'Relate concepts to work you have done.',
    ],
    deliverable: 'Reliability checklist.',
  },
  {
    day: 35,
    date: '2026-12-30',
    week: 5,
    title: 'Review & explain',
    tasks: [
      'Do one 45-minute mock system-design discussion.',
      'Review SQL and Redis with practical examples.',
    ],
    deliverable: 'Mock feedback + revised design.',
  },

  // ---------------- WEEK 6 ----------------
  {
    day: 36,
    date: '2026-12-31',
    week: 6,
    title: 'Scope & design',
    tasks: [
      'Choose a focused project.',
      'Define user stories.',
      'Define MVP scope.',
      'Design architecture.',
      'Design the database schema.',
    ],
    deliverable: 'README plan + architecture sketch.',
  },
  {
    day: 37,
    date: '2027-01-01',
    week: 6,
    title: 'Frontend foundation',
    tasks: [
      'Set up React application.',
      'Configure routing and layout.',
      'Build reusable components.',
      'Implement responsive design.',
      'Add loading and error states early.',
    ],
    deliverable: 'Frontend shell.',
  },
  {
    day: 38,
    date: '2027-01-02',
    week: 6,
    title: 'Backend foundation',
    tasks: [
      'Set up Node/Express.',
      'Configure the application.',
      'Connect the database.',
      'Add validation.',
      'Implement a health endpoint.',
      'Add basic tests.',
    ],
    deliverable: 'Running backend skeleton.',
  },
  {
    day: 39,
    date: '2027-01-03',
    week: 6,
    title: 'Core feature',
    tasks: [
      'Implement the main end-to-end user flow.',
      'Connect UI through API to database.',
      'Keep commits small and meaningful.',
    ],
    deliverable: 'One complete vertical slice.',
  },
  {
    day: 40,
    date: '2027-01-04',
    week: 6,
    title: 'Quality & security',
    tasks: [
      'Add authentication if needed.',
      'Implement input validation.',
      'Add error handling.',
      'Add logging.',
      'Test critical paths.',
    ],
    deliverable: 'Tested core flow.',
  },
  {
    day: 41,
    date: '2027-01-05',
    week: 6,
    title: 'Polish & deploy',
    tasks: [
      'Deploy frontend and backend.',
      'Configure environment variables safely.',
      'Test the live application on desktop and mobile.',
    ],
    deliverable: 'Public demo URL.',
  },
  {
    day: 42,
    date: '2027-01-06',
    week: 6,
    title: 'Explain the project',
    tasks: [
      'Write README covering problem and features.',
      'Document architecture and setup.',
      'Add screenshots.',
      'Explain trade-offs and future work.',
      'Record a 3-minute walkthrough.',
    ],
    deliverable: 'Portfolio-ready project.',
  },

  // ---------------- WEEK 7 ----------------
  {
    day: 43,
    date: '2027-01-07',
    week: 7,
    title: 'JavaScript mock',
    tasks: [
      'Complete a timed JavaScript round.',
      'Cover fundamentals and async behaviour.',
      'Solve 2 coding problems.',
      'Review mistakes rather than only the score.',
    ],
    deliverable: 'Mock score + error log.',
  },
  {
    day: 44,
    date: '2027-01-08',
    week: 7,
    title: 'React mock',
    tasks: [
      'Practise React concepts.',
      'Practise debugging.',
      'Complete a small component exercise.',
      'Explain performance and state decisions.',
    ],
    deliverable: 'React mock feedback.',
  },
  {
    day: 45,
    date: '2027-01-09',
    week: 7,
    title: 'Node + SQL mock',
    tasks: [
      'Practise API design.',
      'Revise Node runtime.',
      'Revise authentication.',
      'Practise SQL queries and Redis trade-offs.',
      'Explain one backend project deeply.',
    ],
    deliverable: 'Backend mock feedback.',
  },
  {
    day: 46,
    date: '2027-01-10',
    week: 7,
    title: 'DSA timed practice',
    tasks: [
      'Solve 3 timed easy/medium problems.',
      'Cover arrays, strings, maps and two pointers.',
      'Explain complexity aloud.',
    ],
    deliverable: '3 solutions + review.',
  },
  {
    day: 47,
    date: '2027-01-11',
    week: 7,
    title: 'System design + project',
    tasks: [
      'Complete a 45-minute system-design round.',
      'Complete a 30-minute portfolio project deep dive.',
      'Refine unclear explanations.',
    ],
    deliverable: 'Design notes + project pitch.',
  },
  {
    day: 48,
    date: '2027-01-12',
    week: 7,
    title: 'Targeted applications',
    tasks: [
      'Apply to 5 relevant roles.',
      'Tailor resume keywords honestly.',
      'Seek referrals where there is a genuine connection.',
    ],
    deliverable: '5 tracked applications.',
  },
  {
    day: 49,
    date: '2027-01-13',
    week: 7,
    title: 'Review & networking',
    tasks: [
      'Review all mock feedback.',
      'Update LinkedIn and project links.',
      'Identify 10 companies or people relevant to GHCI.',
    ],
    deliverable: 'Shortlist + next actions.',
  },

  // ---------------- WEEK 8 ----------------
  {
    day: 50,
    date: '2027-01-14',
    week: 8,
    title: 'Company research',
    tasks: [
      'Research 5 priority companies.',
      'Understand their products.',
      'Research engineering teams.',
      'Identify relevant roles and application routes.',
      'Do not assume they are hiring at GHCI.',
    ],
    deliverable: '5 company briefs.',
  },
  {
    day: 51,
    date: '2027-01-15',
    week: 8,
    title: 'People & questions',
    tasks: [
      'Identify relevant attendees, engineers and recruiters where publicly available.',
      'Prepare thoughtful questions about teams, roles and hiring processes.',
    ],
    deliverable: 'Conversation shortlist + questions.',
  },
  {
    day: 52,
    date: '2027-01-16',
    week: 8,
    title: 'Pitch practice',
    tasks: [
      'Practise a 30-second introduction.',
      'Prepare a 2-minute project story.',
      'Keep it specific to React + Node experience.',
    ],
    deliverable: 'Polished pitch.',
  },
  {
    day: 53,
    date: '2027-01-17',
    week: 8,
    title: 'Resume & portfolio final',
    tasks: [
      'Proofread resume.',
      'Verify GitHub and live demo links.',
      'Pin the best project.',
      'Prepare a QR code or link to your portfolio.',
    ],
    deliverable: 'Final resume + working links.',
  },
  {
    day: 54,
    date: '2027-01-18',
    week: 8,
    title: 'Mock conversations',
    tasks: [
      'Role-play 5 short recruiter/engineer conversations.',
      'Practise asking for advice and next steps.',
      'Avoid demanding a referral.',
    ],
    deliverable: 'Conversation practice notes.',
  },
  {
    day: 55,
    date: '2027-01-19',
    week: 8,
    title: 'Logistics',
    tasks: [
      'Recheck District ticket.',
      'Check photo ID.',
      'Confirm venue and travel.',
      'Confirm arrival time.',
      'Check phone battery and backup of notes.',
      'Check official event updates.',
    ],
    deliverable: 'Event-ready checklist.',
  },
  {
    day: 56,
    date: '2027-01-20',
    week: 8,
    title: 'GHCI Day 1',
    tasks: [
      'Attend GHCI using the event-day checklist.',
      'Have meaningful conversations.',
      'Capture takeaways.',
      'Record specific follow-up actions.',
    ],
    deliverable: 'Conversation notes + follow-up list.',
  },
]

const weekThemes = [
  'Positioning & baseline',
  'JavaScript foundations + DSA',
  'React depth',
  'Node.js + API engineering',
  'SQL, Redis & system design',
  'Portfolio project',
  'Interview & applications',
  'GHCI readiness',
]

export const dailyPlan: DayPlan[] = rawDays.map((d) => ({
  id: `day-${String(d.day).padStart(2, '0')}`,
  day: d.day,
  date: d.date,
  week: d.week,
  title: d.title,
  topic: weekThemes[d.week - 1],
  tasks: d.tasks,
  deliverable: d.deliverable,
}))

type WeekMeta = {
  week: number
  title: string
  range: string
  objective: string
  accent: string
}

const weekMeta: WeekMeta[] = [
  {
    week: 1,
    title: 'Positioning & Baseline',
    range: '26 Nov – 2 Dec 2026',
    objective: 'Understand my starting point and package my experience clearly.',
    accent: '#6366f1',
  },
  {
    week: 2,
    title: 'JavaScript Foundations + DSA',
    range: '3 – 9 Dec 2026',
    objective: 'Build interview-ready JavaScript fundamentals and problem-solving habits.',
    accent: '#0ea5e9',
  },
  {
    week: 3,
    title: 'React Depth',
    range: '10 – 16 Dec 2026',
    objective: 'Explain React rendering and build a small, polished interface.',
    accent: '#8b5cf6',
  },
  {
    week: 4,
    title: 'Node.js + API Engineering',
    range: '17 – 23 Dec 2026',
    objective: 'Build a secure, testable backend API and explain Node runtime behaviour.',
    accent: '#10b981',
  },
  {
    week: 5,
    title: 'SQL, Redis & System Design',
    range: '24 – 30 Dec 2026',
    objective: 'Strengthen data fundamentals and practise structured design discussions.',
    accent: '#f59e0b',
  },
  {
    week: 6,
    title: 'Portfolio Project',
    range: '31 Dec 2026 – 6 Jan 2027',
    objective: 'Ship one credible full-stack project that demonstrates engineering judgement.',
    accent: '#ec4899',
  },
  {
    week: 7,
    title: 'Interview & Applications',
    range: '7 – 13 Jan 2027',
    objective: 'Turn preparation into interview performance and targeted applications.',
    accent: '#ef4444',
  },
  {
    week: 8,
    title: 'GHCI Readiness',
    range: '14 – 20 Jan 2027',
    objective: 'Arrive prepared with a clear pitch, strong examples and a follow-up system.',
    accent: '#14b8a6',
  },
]

export const weeks: WeekPlan[] = weekMeta.map((w) => {
  const days = dailyPlan.filter((d) => d.week === w.week)
  return {
    ...w,
    focus: days.map((d) => d.title),
    deliverables: days.map((d) => d.deliverable),
  }
})

export const EVENT_DATE = '2027-01-20'
export const PROGRAM_START = '2026-11-26'
