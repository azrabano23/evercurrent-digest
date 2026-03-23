import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import ThreadPanel from './components/ThreadPanel.jsx'
import DigestPanel from './components/DigestPanel.jsx'
import { generateDigest } from './lib/generator.js'

export default function App() {
  const [role,   setRole]   = useState('Electrical Engineer')
  const [phase,  setPhase]  = useState('DVT')
  const [digest, setDigest] = useState([])
  const [activeThread, setActiveThread] = useState(null)

  // Re-score and re-rank whenever role or phase changes
  useEffect(() => {
    const items = generateDigest(role, phase)
    setDigest(items)
  }, [role, phase])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header role={role} setRole={setRole} phase={phase} setPhase={setPhase} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ThreadPanel activeThreadId={activeThread} />
        <DigestPanel
          digest={digest}
          role={role}
          phase={phase}
          onThreadClick={setActiveThread}
        />
      </div>
    </div>
  )
}
