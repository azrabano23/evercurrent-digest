import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import ThreadPanel from './components/ThreadPanel.jsx'
import DigestPanel from './components/DigestPanel.jsx'
import { generateDigest } from './lib/generator.js'

export default function App() {
  // these two things control everything — who's reading and where the project is
  const [role,   setRole]   = useState('Electrical Engineer')
  const [phase,  setPhase]  = useState('DVT')
  const [digest, setDigest] = useState([])

  // any time role or phase changes, re-run the scoring and update the digest
  // this is what makes the right panel feel alive
  useEffect(() => {
    const items = generateDigest(role, phase)
    setDigest(items)
  }, [role, phase])

  return (
    // full screen, no scroll on the outside — each panel scrolls on its own
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header role={role} setRole={setRole} phase={phase} setPhase={setPhase} />

      {/* left = raw slack threads, right = your personalized digest */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ThreadPanel />
        <DigestPanel digest={digest} role={role} phase={phase} />
      </div>
    </div>
  )
}
