import React from 'react'
import { useStore } from '../store'
import { eventDetails, eventItems, networkingGoals } from '../data/event'
import type { EventPhase } from '../types'
import { Badge, Bar, Check, Stat } from '../components/ui'
import { Icon } from '../components/Icon'

const phases: { phase: EventPhase; icon: 'mapPin' | 'users' | 'mail'; tone: string; blurb: string }[] = [
  { phase: 'Before the event', icon: 'mapPin', tone: 'var(--primary)', blurb: 'Preparation that removes friction on the day.' },
  { phase: 'During the event', icon: 'users', tone: 'var(--teal)', blurb: 'Be present, curious and intentional with your time.' },
  { phase: 'After the event', icon: 'mail', tone: 'var(--amber)', blurb: 'The follow-up is where most of the value is created.' },
]

export function EventDay() {
  const { store, actions, metrics } = useStore()
  const before = eventItems.filter((i) => i.phase === 'Before the event')
  const during = eventItems.filter((i) => i.phase === 'During the event')
  const after = eventItems.filter((i) => i.phase === 'After the event')

  const countdown = metrics.daysToEvent

  return (
    <div className="stack">
      <section className="event-hero">
        <div className="row-between wrap" style={{ gap: 20 }}>
          <div>
            <div className="eyebrow" style={{ color: '#5eead4' }}>Event-day command centre</div>
            <h1>{eventDetails.name}</h1>
            <p>{eventDetails.note}</p>
            <div className="event-facts">
              <div className="event-fact">
                <span>Pass</span>
                <strong>{eventDetails.pass}</strong>
              </div>
              <div className="event-fact">
                <span>Date</span>
                <strong>{eventDetails.date}</strong>
              </div>
              <div className="event-fact">
                <span>Time</span>
                <strong>{eventDetails.time}</strong>
              </div>
              <div className="event-fact">
                <span>Venue</span>
                <strong>{eventDetails.venue}</strong>
              </div>
            </div>
          </div>
          <div className="countdown" style={{ minWidth: 170 }}>
            <strong>{countdown > 0 ? countdown : countdown === 0 ? '0' : '✓'}</strong>
            <span>{countdown > 0 ? 'days to event' : countdown === 0 ? 'event day' : 'event complete'}</span>
            <small>{eventDetails.date}</small>
          </div>
        </div>
      </section>

      <div className="grid grid-4">
        <Stat label="Checklist complete" value={<>{metrics.eventPct}<small>%</small></>} icon="ticket" tone="indigo" foot={<span>{metrics.eventDone}/{metrics.eventTotal} items</span>} />
        <Stat label="Meaningful conversations" value={store.goals.g1 ?? 0} icon="users" tone="teal" sub={`target ${networkingGoals[0].target}`} foot={<span>Depth over business cards</span>} />
        <Stat label="Relevant connections" value={store.goals.g2 ?? 0} icon="linkedin" tone="sky" sub={`target ${networkingGoals[1].target}`} foot={<span>Personalise every request</span>} />
        <Stat label="Potential role leads" value={store.goals.g3 ?? 0} icon="target" tone="green" sub={`target ${networkingGoals[2].target}`} foot={<span>Only genuine leads</span>} />
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Networking goals</div>
              <div className="card-sub">Update these honestly during and after the event</div>
            </div>
            <Badge tone="teal">{store.goals.g4 ?? 0} follow-ups sent</Badge>
          </div>
          {networkingGoals.map((g) => {
            const value = store.goals[g.id] ?? 0
            const pct = Math.min(100, Math.round((value / g.target) * 100))
            return (
              <div className="goal-row" key={g.id}>
                <div className="goal-main">
                  <div className="goal-label">{g.label}</div>
                  <div className="goal-bar"><Bar value={pct} tone={pct >= 100 ? 'green' : 'indigo'} slim /></div>
                </div>
                <div className="stepper">
                  <button onClick={() => actions.setGoal(g.id, value - 1)} aria-label={`Decrease ${g.label}`}>−</button>
                  <span>{value}</span>
                  <button onClick={() => actions.setGoal(g.id, value + 1)} aria-label={`Increase ${g.label}`}>+</button>
                </div>
                <div className="goal-count">{pct}%<br /><small>of {g.target}</small></div>
              </div>
            )
          })}
          <div className="divider" />
          <p className="subtle">
            These goals are suggestions, not guarantees. A handful of genuine conversations and thoughtful follow-ups
            are worth more than collecting contacts.
          </p>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">My event-day plan</div>
              <div className="card-sub">Sessions, companies, people and timing</div>
            </div>
            <Icon name="notes" size={17} />
          </div>
          <textarea
            className="textarea"
            style={{ minHeight: 170 }}
            placeholder="09:00 arrival and registration&#10;09:30 session …&#10;11:00 priority company booths …&#10;13:00 lunch + informal conversations&#10;15:00 expo and follow-ups"
            value={store.eventNotes.plan ?? ''}
            onChange={(e) => actions.setEventNote('plan', e.target.value)}
          />
          <div className="row wrap mt-2">
            <Badge tone="indigo">{eventDetails.date}</Badge>
            <Badge tone="teal">{eventDetails.time}</Badge>
            <Badge tone="slate">KTPO, Whitefield</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-3">
        {phases.map((p) => {
          const items = p.phase === 'Before the event' ? before : p.phase === 'During the event' ? during : after
          const done = items.filter((i) => store.event[i.id]).length
          const pct = Math.round((done / items.length) * 100)
          return (
            <div className="card" key={p.phase}>
              <div className="phase-head">
                <div className="phase-icon" style={{ background: `color-mix(in srgb, ${p.tone} 12%, white)`, color: p.tone }}>
                  <Icon name={p.icon} size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="card-title">{p.phase}</div>
                  <div className="card-sub">{p.blurb}</div>
                </div>
              </div>
              <div className="row-between mb-1">
                <span className="tiny subtle">{done}/{items.length} complete</span>
                <span className="tiny" style={{ fontWeight: 700 }}>{pct}%</span>
              </div>
              <Bar value={pct} tone={pct === 100 ? 'green' : 'indigo'} slim />
              <div className="mt-2">
                {items.map((i) => (
                  <div key={i.id} style={{ padding: '2px 0' }}>
                    <Check
                      checked={Boolean(store.event[i.id])}
                      onChange={() => actions.toggleEvent(i.id)}
                      label={
                        <span>
                          {i.label}
                          <span className="tiny subtle" style={{ display: 'block', marginTop: 1 }}>{i.hint}</span>
                        </span>
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="field mt-2">
                <label className="label">Notes for this phase</label>
                <textarea
                  className="textarea"
                  style={{ minHeight: 54, fontSize: 12 }}
                  placeholder="Anything you want to remember or change?"
                  value={store.eventNotes[p.phase] ?? ''}
                  onChange={(e) => actions.setEventNote(p.phase, e.target.value)}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Event facts</div>
              <div className="card-sub">Verify logistics against your ticket before travelling</div>
            </div>
            <Icon name="ticket" size={17} />
          </div>
          <div className="kv"><span>Event</span><strong>{eventDetails.name}</strong></div>
          <div className="kv"><span>Pass</span><strong>{eventDetails.pass}</strong></div>
          <div className="kv"><span>Date</span><strong>{eventDetails.date}</strong></div>
          <div className="kv"><span>Time</span><strong>{eventDetails.time}</strong></div>
          <div className="kv"><span>Venue</span><strong style={{ maxWidth: 280 }}>{eventDetails.venue}</strong></div>
          <div className="divider" />
          <p className="subtle">
            Double-check the official event communication for any change in timings, entry requirements or venue
            access. This tracker stores your plan, not the organiser&apos;s live schedule.
          </p>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Conversation starters</div>
              <div className="card-sub">Specific beats generic — adapt these to the person</div>
            </div>
            <Icon name="sparkles" size={17} />
          </div>
          <div className="list">
            {[
              'What is the most interesting engineering problem your team is working on right now?',
              'How does your team split work between frontend and backend engineers?',
              'What does a strong first 90 days look like for a full-stack engineer here?',
              'How do you evaluate React and Node trade-offs when a feature spans both?',
              'What is the hiring process like, and what do interviewers weight most?',
              'What did you wish you knew before joining this team?',
            ].map((q) => (
              <div className="list-item" key={q} style={{ padding: '8px 0' }}>
                <div className="list-icon" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
                  <Icon name="message" size={13} />
                </div>
                <div className="list-main">
                  <div className="list-title" style={{ fontWeight: 500 }}>{q}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
