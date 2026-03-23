import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import ThreadPanel from './components/ThreadPanel.jsx'
import DigestPanel from './components/DigestPanel.jsx'
import { generateDigest } from './lib/generator.js'

export default function App() {
  // role and phase are the two things the user controls from the header
  // changing either one re-scores everything
  const [role,   setRole]   = useState('Electrical Engineer')
  const [phase,  setPhase]  = useState('DVT')
  const [digest, setDigest] = useState([])

  // whenever role or phase changes, run the scoring engine again
  // this is what makes the digest personalized in real time
  useEffect(() => {
    const items = generateDigest(role, phase)
    setDigest(items)
  }, [role, phase])

  return (
    // full height, no scroll on the outer shell — each panel handles its own scroll
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header role={role} setRole={setRole} phase={phase} setPhase={setPhase} />

      {/* two panels side by side: raw slack threads on the left, ranked digest on the right */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ThreadPanel />
        <DigestPanel digest={digest} role={role} phase={phase} />
      </div>
    </div>
  )
}
