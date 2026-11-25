import React, { useState } from 'react'
import type { NavKey } from './types'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Roadmap } from './pages/Roadmap'
import { Daily } from './pages/Daily'
import { Dsa } from './pages/Dsa'
import { Interview } from './pages/Interview'
import { Portfolio } from './pages/Portfolio'
import { Applications } from './pages/Applications'
import { Networking } from './pages/Networking'
import { EventDay } from './pages/EventDay'
import { Notes } from './pages/Notes'
import { currentWeekNumber } from './lib/date'

const validKeys: NavKey[] = [
  'dashboard',
  'roadmap',
  'daily',
  'dsa',
  'interview',
  'portfolio',
  'applications',
  'networking',
  'event',
  'notes',
]

function initialNav(): NavKey {
  const hash = window.location.hash.replace('#', '') as NavKey
  return validKeys.includes(hash) ? hash : 'dashboard'
}

export default function App() {
  const [active, setActive] = useState<NavKey>(initialNav)
  const [dailyWeek, setDailyWeek] = useState<number | 'all'>(currentWeekNumber())

  const navigate = (k: NavKey) => {
    setActive(k)
    if (window.location.hash !== `#${k}`) {
      window.history.replaceState(null, '', `#${k}`)
    }
  }

  const openWeek = (week: number) => {
    setDailyWeek(week)
    navigate('daily')
  }

  return (
    <Layout active={active} onNavigate={navigate}>
      {active === 'dashboard' && <Dashboard navigate={navigate} />}
      {active === 'roadmap' && <Roadmap navigate={navigate} openWeek={openWeek} />}
      {active === 'daily' && <Daily week={dailyWeek} onWeekChange={setDailyWeek} />}
      {active === 'dsa' && <Dsa />}
      {active === 'interview' && <Interview />}
      {active === 'portfolio' && <Portfolio />}
      {active === 'applications' && <Applications />}
      {active === 'networking' && <Networking />}
      {active === 'event' && <EventDay />}
      {active === 'notes' && <Notes />}
    </Layout>
  )
}
