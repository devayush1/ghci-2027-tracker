import type { Milestone } from '../types'

export const portfolioProject = {
  name: 'DevAssist AI',
  tagline: 'A focused AI developer assistant that proves full-stack engineering, not just feature shipping.',
  stack: ['React + TypeScript', 'Node.js + Express', 'PostgreSQL', 'Redis', 'LLM API', 'Docker'],
  constraints: [
    'Ship a working, deployable MVP — do not over-engineer.',
    'Every feature must be demonstrable in a three-minute walkthrough.',
    'Tests, logging and error handling are part of the product, not extras.',
  ],
}

export const milestones: Milestone[] = [
  {
    id: 'm1',
    title: 'Requirements & scope',
    description: 'Define the MVP, user stories, success criteria and explicit non-goals.',
    tasks: [
      { id: 'm1t1', label: 'Write user stories for auth, chat and history' },
      { id: 'm1t2', label: 'Define non-goals and out-of-scope features' },
      { id: 'm1t3', label: 'Set success criteria for the demo' },
      { id: 'm1t4', label: 'Identify top three risks' },
    ],
  },
  {
    id: 'm2',
    title: 'Architecture & database design',
    description: 'Draw the system, define the schema and lock the API contract.',
    tasks: [
      { id: 'm2t1', label: 'Architecture diagram with frontend, API, DB and Redis' },
      { id: 'm2t2', label: 'ER schema for users, conversations and messages' },
      { id: 'm2t3', label: 'API contract with request/response shapes' },
      { id: 'm2t4', label: 'Environment and secrets strategy' },
    ],
  },
  {
    id: 'm3',
    title: 'Frontend setup',
    description: 'React + TypeScript shell with routing, layout and auth screens.',
    tasks: [
      { id: 'm3t1', label: 'Vite + React + TypeScript project' },
      { id: 'm3t2', label: 'Routing and app layout' },
      { id: 'm3t3', label: 'Design tokens and reusable components' },
      { id: 'm3t4', label: 'Login and register screens' },
      { id: 'm3t5', label: 'Typed API client with error handling' },
    ],
  },
  {
    id: 'm4',
    title: 'Backend setup',
    description: 'Express + TypeScript service with PostgreSQL and health checks.',
    tasks: [
      { id: 'm4t1', label: 'Express + TypeScript project structure' },
      { id: 'm4t2', label: 'PostgreSQL connection and migrations' },
      { id: 'm4t3', label: 'Health endpoint and request logging' },
      { id: 'm4t4', label: 'Central error handler' },
    ],
  },
  {
    id: 'm5',
    title: 'Authentication',
    description: 'Secure register/login, JWT issuance and protected routes.',
    tasks: [
      { id: 'm5t1', label: 'Password hashing and validation' },
      { id: 'm5t2', label: 'JWT issuance and verification' },
      { id: 'm5t3', label: 'Auth middleware and protected route' },
      { id: 'm5t4', label: 'Frontend auth state and redirects' },
    ],
  },
  {
    id: 'm6',
    title: 'Core features',
    description: 'Streaming chat, conversation history and a responsive dashboard.',
    tasks: [
      { id: 'm6t1', label: 'LLM API integration with streaming' },
      { id: 'm6t2', label: 'Chat interface with stop and error states' },
      { id: 'm6t3', label: 'Conversation history persistence' },
      { id: 'm6t4', label: 'Responsive dashboard with usage stats' },
    ],
  },
  {
    id: 'm7',
    title: 'Redis integration',
    description: 'Caching, usage tracking and per-user rate limiting.',
    tasks: [
      { id: 'm7t1', label: 'Cache recent conversations with TTL' },
      { id: 'm7t2', label: 'Usage counters per user' },
      { id: 'm7t3', label: 'Per-user rate limiting and 429 UX' },
      { id: 'm7t4', label: 'Cache invalidation on write' },
    ],
  },
  {
    id: 'm8',
    title: 'Testing',
    description: 'Unit and API tests for the flows that matter.',
    tasks: [
      { id: 'm8t1', label: 'Auth endpoint integration tests' },
      { id: 'm8t2', label: 'Chat and history API tests' },
      { id: 'm8t3', label: 'Frontend component tests for the chat form' },
      { id: 'm8t4', label: 'One end-to-end smoke test' },
    ],
  },
  {
    id: 'm9',
    title: 'Deployment',
    description: 'Docker, environment config and a public demo URL.',
    tasks: [
      { id: 'm9t1', label: 'Dockerfile and docker-compose' },
      { id: 'm9t2', label: 'Production environment variables' },
      { id: 'm9t3', label: 'Database migration on deploy' },
      { id: 'm9t4', label: 'Deploy frontend and backend' },
      { id: 'm9t5', label: 'Verify the public demo URL' },
    ],
  },
  {
    id: 'm10',
    title: 'Documentation & demonstration',
    description: 'README, screenshots, architecture diagram and walkthrough.',
    tasks: [
      { id: 'm10t1', label: 'README with setup and architecture' },
      { id: 'm10t2', label: 'Screenshots and demo GIF' },
      { id: 'm10t3', label: 'Architecture diagram exported' },
      { id: 'm10t4', label: 'Three-minute walkthrough recorded' },
      { id: 'm10t5', label: 'Pinned on GitHub and added to portfolio' },
    ],
  },
]

export const seedMilestones = () => {
  const out: Record<string, { status: 'Not Started'; notes: string; tasks: Record<string, boolean> }> = {}
  for (const m of milestones) {
    out[m.id] = {
      status: 'Not Started',
      notes: '',
      tasks: Object.fromEntries(m.tasks.map((t) => [t.id, false])),
    }
  }
  return out
}
