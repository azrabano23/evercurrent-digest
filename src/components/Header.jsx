import { ROLES, PHASES } from '../data/mockData.js'

const ROLE_COLORS = {
  'Electrical Engineer':  '#60a5fa',
  'Mechanical Engineer':  '#fb923c',
  'Supply Chain':         '#fbbf24',
  'Engineering Manager':  '#c084fc',
  'Product Manager':      '#f472b6',
}

// top bar — pick your role and phase, everything else updates instantly
export default function Header({ role, setRole, phase, setPhase }) {
  const rc = ROLE_COLORS[role] ?? '#60a5fa'

  return (
    <header style={{
      height: '52px',
      background: 'rgba(10,11,16,0.92)',
      borderBottom: '1px solid #1c2030',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: '20px',
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* subtle accent line at the very bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, #3b82f620, #8b5cf620, transparent)',
        pointerEvents: 'none',
      }} />

      {/* logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '7px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px rgba(99,102,241,0.35)',
        }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M3.5 7.5h4M7.5 4.5l3.5 3-3.5 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#eceef5', letterSpacing: '-0.5px' }}>EverCurrent</span>
          <span style={{ fontSize: '11px', color: '#2a2e40' }}>/</span>
          <span style={{ fontSize: '11px', color: '#4e5264' }}>Daily Digest</span>
        </div>
      </div>

      <div style={{ width: '1px', height: '20px', background: '#1c2030' }} />

      {/* role picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: '#4e5264' }}>Viewing as</span>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          background: '#141720',
          border: `1px solid ${rc}30`,
          borderRadius: '7px', padding: '5px 10px',
          position: 'relative',
          boxShadow: `0 0 0 1px ${rc}10, 0 2px 8px rgba(0,0,0,0.3)`,
          cursor: 'pointer',
        }}>
          {/* glowing role dot */}
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: rc,
            boxShadow: `0 0 8px ${rc}, 0 0 16px ${rc}60`,
            flexShrink: 0,
          }} />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{
              background: 'transparent', border: 'none',
              color: '#eceef5', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', outline: 'none',
              appearance: 'none', WebkitAppearance: 'none',
              paddingRight: '18px',
            }}
          >
            {ROLES.map(r => (
              <option key={r.id} value={r.id} style={{ background: '#0f1117' }}>{r.label}</option>
            ))}
          </select>
          <svg style={{ position: 'absolute', right: '8px', pointerEvents: 'none' }} width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="#4e5264" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div style={{ width: '1px', height: '20px', background: '#1c2030' }} />

      {/* phase switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: '#4e5264' }}>Phase</span>
        <div style={{
          display: 'flex',
          background: '#0f1117',
          border: '1px solid #1c2030',
          borderRadius: '8px',
          padding: '3px',
          gap: '2px',
        }}>
          {PHASES.map(p => {
            const active = p.id === phase
            return (
              <button
                key={p.id}
                onClick={() => setPhase(p.id)}
                style={{
                  fontSize: '11px',
                  fontWeight: active ? 600 : 400,
                  padding: '4px 11px',
                  borderRadius: '5px',
                  color: active ? '#eceef5' : '#4e5264',
                  background: active
                    ? 'linear-gradient(135deg, #1f2435, #242840)'
                    : 'transparent',
                  boxShadow: active ? '0 1px 4px rgba(0,0,0,0.4)' : 'none',
                  border: active ? '1px solid #2a2e40' : '1px solid transparent',
                  transition: 'all 0.14s ease',
                }}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* date — right side */}
      <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#2a2e40', letterSpacing: '0.2px' }}>
        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
    </header>
  )
}
