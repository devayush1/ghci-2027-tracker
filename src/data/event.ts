import type { EventItem, NetworkingGoal } from '../types'

export const eventDetails = {
  name: 'GHCI 2027',
  pass: 'Early Career — In Person, Day 1',
  date: '20 January 2027',
  dateISO: '2027-01-20',
  time: '9:00 AM – 6:00 PM',
  venue: 'Karnataka Trade Promotion Organisation (KTPO), Whitefield, Bengaluru',
  note: 'GHCI is a career and networking opportunity — not a guaranteed interview, recruiter meeting or job offer. Treat every conversation as a relationship, not a transaction.',
}

export const eventItems: EventItem[] = [
  { id: 'e1', phase: 'Before the event', label: 'Ticket QR code saved offline', hint: 'Screenshot it and keep it in a favourites album.' },
  { id: 'e2', phase: 'Before the event', label: 'Government photo ID packed', hint: 'Check the event guidelines for accepted ID.' },
  { id: 'e3', phase: 'Before the event', label: 'Resume PDF on phone and in cloud', hint: 'Name the file Firstname_Lastname_FullStack.pdf.' },
  { id: 'e4', phase: 'Before the event', label: 'Portfolio and GitHub links verified', hint: 'Open each link in incognito to confirm access.' },
  { id: 'e5', phase: 'Before the event', label: 'Phone charged and power bank packed', hint: 'Networking drains battery fast.' },
  { id: 'e6', phase: 'Before the event', label: 'Company research notes ready', hint: 'Six priority companies with three questions each.' },
  { id: 'e7', phase: 'Before the event', label: 'Recruiter and engineer questions prepared', hint: 'Ten each, specific to teams and engineering work.' },
  { id: 'e8', phase: 'Before the event', label: '30-second intro rehearsed', hint: 'Time it: 28–32 seconds, no filler.' },
  { id: 'e9', phase: 'Before the event', label: 'Travel route and arrival time planned', hint: 'Arrive early; Whitefield traffic is unpredictable.' },
  { id: 'e10', phase: 'Before the event', label: 'Comfortable outfit and shoes ready', hint: 'You will be on your feet for hours.' },

  { id: 'e11', phase: 'During the event', label: 'Attend sessions relevant to full-stack and AI', hint: 'Take notes you can turn into follow-up questions.' },
  { id: 'e12', phase: 'During the event', label: 'Explore the expo and attendee activities', hint: 'Use the floor map and session schedule.' },
  { id: 'e13', phase: 'During the event', label: 'Have five meaningful conversations', hint: 'Depth beats collecting badges.' },
  { id: 'e14', phase: 'During the event', label: 'Ask about teams, engineering work and hiring process', hint: 'Ask what a strong first 90 days looks like.' },
  { id: 'e15', phase: 'During the event', label: 'Connect on LinkedIn where appropriate', hint: 'Mention the conversation in the request note.' },
  { id: 'e16', phase: 'During the event', label: 'Record insights and next steps after each chat', hint: 'Step aside and type three lines immediately.' },
  { id: 'e17', phase: 'During the event', label: 'Collect contact details for genuine leads', hint: 'Name, company, team, follow-up action.' },
  { id: 'e18', phase: 'During the event', label: 'Take breaks and stay hydrated', hint: 'You cannot network well when exhausted.' },

  { id: 'e19', phase: 'After the event', label: 'Organise all contacts in the CRM', hint: 'Add context while memory is fresh.' },
  { id: 'e20', phase: 'After the event', label: 'Send personalised follow-ups within 24–48 hours', hint: 'Reference a specific detail from the conversation.' },
  { id: 'e21', phase: 'After the event', label: 'Follow up on genuine opportunities', hint: 'Only where there was real mutual interest.' },
  { id: 'e22', phase: 'After the event', label: 'Update the job application tracker', hint: 'Log roles discussed and next steps.' },
  { id: 'e23', phase: 'After the event', label: 'Record your learnings and reflections', hint: 'What surprised you? What will you change?' },
  { id: 'e24', phase: 'After the event', label: 'Share a short takeaway with your network', hint: 'Optional, but it keeps the conversation going.' },
]

export const networkingGoals: NetworkingGoal[] = [
  { id: 'g1', label: 'Meaningful company / recruiter / engineer conversations', target: 5 },
  { id: 'g2', label: 'Relevant professional connections', target: 15 },
  { id: 'g3', label: 'Potential role leads', target: 3 },
  { id: 'g4', label: 'Personalised follow-up messages', target: 5 },
]

export const seedEvent = () => Object.fromEntries(eventItems.map((i) => [i.id, false]))
export const seedGoals = () => Object.fromEntries(networkingGoals.map((g) => [g.id, 0]))
