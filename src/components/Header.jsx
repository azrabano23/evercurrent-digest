import { ROLES, PHASES } from '../data/mockData.js'

// each role gets its own color so you can tell at a glance who you're viewing as
const ROLE_COLORS = {
  'Electrical Engineer':  '#60a5fa',
  'Mechanical Engineer':  '#fb923c',
  'Supply Chain':         '#fbbf24',
  'Engineering Manager':  '#c084fc',
  'Product Manager':      '#f472b6',
}

// the top bar with two controls:
// 1. who are you? (role dropdown)
// 2. where is the project? (phase buttons)
// changing either one re-scores everything on the right instantly

export default function Header({ role, setRole, phase, setPhase }) {
  const rc = ROLE_COLORS[role] ?? '#60a5fa'

  return (
    <header style={{
      height: '52px',
      background: '#13151c',
      borderBottom: '1px solid #1f2230',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: '24px',
      flexShrink: 0,
    }}>

      {/* logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <rect width="26" height="26" rx="6" fill="url(#logo-grad)"/>
          <path d="M7 13h5M13 8l5 5-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="26" y2="26">
              <stop offset="0%" stopColor="#3b82f6"/>
              <stop offset="100%" stopColor="#8b5cf6"/>
            </linearGradient>
          </defs>
        </svg>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#e8eaf0', letterSpacing: '-0.4px' }}>EverCurrent</span>
        <span style={{ fontSize: '12px', color: '#1f2230' }}>/</span>
        <span style={{ fontSize: '12px', color: '#50535e', fontWeight: 400 }}>Daily Digest</span>
      </div>

      <div style={{ width: '1px', height: '18px', background: '#1f2230' }} />

      {/* pick your role — the little dot changes color to match */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: '#50535e' }}>Viewing as</span>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          background: '#181b24', border: '1px solid #262a38',
          borderRadius: '6px', padding: '5px 10px', cursor: 'pointer',
          position: 'relative',
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: rc, flexShrink: 0, boxShadow: `0 0 6px ${rc}80`,
          }} />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{
              background: 'transparent', border: 'none',
              color: '#e8eaf0', fontSize: '12px', fontWeight: 500,
              cursor: 'pointer', outline: 'none',
              appearance: 'none', WebkitAppearance: 'none',
              paddingRight: '16px',
            }}
          >
            {ROLES.map(r => (
              <option key={r.id} value={r.id} style={{ background: '#13151c' }}>{r.label}</option>
            ))}
          </select>
          {/* custom arrow since we hid the browser's default one */}
          <svg style={{ position: 'absolute', right: '8px', pointerEvents: 'none' }} width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="#50535e" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div style={{ width: '1px', height: '18px', background: '#1f2230' }} />

      {/* project phase — like difficulty levels: Prototype is easy mode, PVT is hard mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: '#50535e' }}>Phase</span>
        <div style={{
          display: 'flex', background: '#181b24',
          border: '1px solid #262a38', borderRadius: '6px', padding: '3px',
        }}>
          {PHASES.map(p => {
            const active = p.id === phase
            return (
              <button key={p.id} onClick={() => setPhase(p.id)} style={{
                fontSize: '11px', fontWeight: active ? 600 : 400,
                padding: '3px 10px', borderRadius: '4px',
                color: active ? '#e8eaf0' : '#50535e',
                background: active ? '#262a38' : 'transparent',
                transition: 'all 0.12s',
              }}>
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#2e3040' }}>
        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
    </header>
  )
}
