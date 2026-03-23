import DigestCard from './DigestCard.jsx'

const PHASE_NOTE = {
  Prototype: 'Decisions and open questions weighted highest · supply chain noise suppressed',
  EVT:       'Blockers and dependencies amplified · test failures surface first',
  DVT:       'Systemic risk and supply chain urgency elevated · spec changes flagged',
  PVT:       'All open questions critical · any proposed change triggers priority escalation',
}

const TIERS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

const TIER_META = {
  CRITICAL: { label: 'Critical', color: '#f87171', glow: 'rgba(248,113,113,0.15)' },
  HIGH:     { label: 'High',     color: '#fb923c', glow: 'rgba(251,146,60,0.12)'  },
  MEDIUM:   { label: 'Medium',   color: '#fbbf24', glow: 'rgba(251,191,36,0.10)'  },
  LOW:      { label: 'Low',      color: '#4ade80', glow: 'rgba(74,222,128,0.08)'  },
}

const ROLE_COLORS = {
  'Electrical Engineer':  '#60a5fa',
  'Mechanical Engineer':  '#fb923c',
  'Supply Chain':         '#fbbf24',
  'Engineering Manager':  '#c084fc',
  'Product Manager':      '#f472b6',
}

// one-line plain english summary of what's happening in each phase
const SCENARIO_CONTEXT = `A robotics hardware team is in DVT — they're testing whether the design actually holds up. Right now: the circuit board has a dead power rail, a key part won't arrive in time, the chassis cracked during vibration testing, and the April 15 deadline is at risk. Switch roles to see who needs to know what.`

// the right panel — personalized digest, ranked by what matters to you right now
export default function DigestPanel({ digest, role, phase }) {
  const rc      = ROLE_COLORS[role] ?? '#60a5fa'
  const note    = PHASE_NOTE[phase] ?? ''
  const criticals = digest.filter(d => d.priority === 'CRITICAL').length

  // group by tier, skip empty ones
  const groups = TIERS
    .map(p => ({ tier: p, items: digest.filter(d => d.priority === p) }))
    .filter(g => g.items.length > 0)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0a0b10' }}>

      {/* panel header */}
      <div style={{
        padding: '14px 24px 13px',
        background: 'linear-gradient(180deg, #0f1117, #0a0b10)',
        borderBottom: '1px solid #1c2030',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>

          {/* role indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: rc,
              boxShadow: `0 0 8px ${rc}, 0 0 20px ${rc}50`,
            }} />
            <h1 style={{ fontSize: '14px', fontWeight: 700, color: '#eceef5', letterSpacing: '-0.4px' }}>
              {role}
            </h1>
          </div>

          <span style={{ color: '#1c2030', fontSize: '16px' }}>·</span>
          <span style={{ fontSize: '12px', color: '#4e5264', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>
            {phase}
          </span>

          {/* red badge if criticals exist */}
          {criticals > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '11px', fontWeight: 700, color: '#f87171',
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '6px', padding: '2px 9px',
            }}>
              <div style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: '#f87171', boxShadow: '0 0 6px #f87171',
              }} />
              {criticals} critical
            </div>
          )}

          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#2a2e40' }}>
            {digest.length} signals · ranked by relevance
          </span>
        </div>

        {/* phase note */}
        <p style={{
          fontSize: '11px', color: '#2a2e40',
          paddingLeft: '16px',
          borderLeft: '2px solid #1c2030',
        }}>
          {note}
        </p>
      </div>

      {/* what's happening in this project — plain english context */}
      <div style={{
        margin: '16px 24px 0',
        padding: '11px 14px',
        background: '#0f1117',
        border: '1px solid #1c2030',
        borderRadius: '8px',
        flexShrink: 0,
      }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#4e5264', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '5px' }}>
          What's happening in this project
        </p>
        <p style={{ fontSize: '11px', color: '#4e5264', lineHeight: 1.6 }}>
          {SCENARIO_CONTEXT}
        </p>
      </div>

      {/* digest cards, grouped and scrollable */}
      <div style={{
        overflowY: 'auto', flex: 1,
        padding: '22px 24px 32px',
        display: 'flex', flexDirection: 'column', gap: '28px',
      }}>
        {groups.map(({ tier, items }) => {
          const tm = TIER_META[tier]
          return (
            <div key={tier}>
              {/* section header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: tm.color,
                  boxShadow: `0 0 8px ${tm.color}, 0 0 16px ${tm.glow}`,
                }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: tm.color, letterSpacing: '0.2px' }}>
                  {tm.label}
                </span>
                <span style={{ fontSize: '11px', color: '#2a2e40' }}>· {items.length}</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #1c2030, transparent)', marginLeft: '4px' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {items.map(item => <DigestCard key={item.id} item={item} />)}
              </div>
            </div>
          )
        })}

        {digest.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#2a2e40', fontSize: '13px' }}>
            No signals for this role and phase.
          </div>
        )}
      </div>
    </div>
  )
}
