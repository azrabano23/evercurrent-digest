import DigestCard from './DigestCard.jsx'

// a little hint at the top explaining how the phase changes what you see
const PHASE_NOTE = {
  Prototype: 'Decisions and open questions weighted highest · supply chain noise suppressed',
  EVT:       'Blockers and dependencies amplified · test failures surface first',
  DVT:       'Systemic risk and supply chain urgency elevated · spec changes flagged',
  PVT:       'All open questions critical · any proposed change triggers priority escalation',
}

// we always show critical stuff first
const TIERS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

const TIER_LABELS = { CRITICAL: 'Critical', HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' }
const TIER_COLORS = { CRITICAL: '#f87171', HIGH: '#fb923c', MEDIUM: '#fbbf24', LOW: '#4ade80' }
const ROLE_COLORS = {
  'Electrical Engineer':  '#60a5fa',
  'Mechanical Engineer':  '#fb923c',
  'Supply Chain':         '#fbbf24',
  'Engineering Manager':  '#c084fc',
  'Product Manager':      '#f472b6',
}

// the main right panel — your personalized list of what to pay attention to today
export default function DigestPanel({ digest, role, phase }) {
  const rc   = ROLE_COLORS[role] ?? '#60a5fa'
  const note = PHASE_NOTE[phase] ?? ''

  // count how many are critical so we can show a red badge
  const criticals = digest.filter(d => d.priority === 'CRITICAL').length

  // split the digest into groups by priority level
  // filter out any tiers with nothing in them so we don't show empty sections
  const groups = TIERS
    .map(p => ({ tier: p, items: digest.filter(d => d.priority === p) }))
    .filter(g => g.items.length > 0)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* who's reading and what phase — locked at the top */}
      <div style={{
        padding: '14px 24px 12px',
        background: '#13151c',
        borderBottom: '1px solid #1f2230',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: rc, boxShadow: `0 0 8px ${rc}70`,
            }} />
            <h1 style={{ fontSize: '14px', fontWeight: 700, color: '#e8eaf0', letterSpacing: '-0.3px' }}>
              {role}
            </h1>
          </div>
          <span style={{ color: '#1f2230' }}>·</span>
          <span style={{ fontSize: '12px', color: '#50535e', fontFamily: 'ui-monospace, monospace', fontWeight: 500 }}>
            {phase}
          </span>

          {/* red badge — only shows up if something is critical */}
          {criticals > 0 && (
            <span style={{
              fontSize: '11px', fontWeight: 600, color: '#f87171',
              background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.22)',
              borderRadius: '4px', padding: '1px 8px',
            }}>
              {criticals} critical
            </span>
          )}

          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#2e3040' }}>
            {digest.length} signals · ranked by relevance
          </span>
        </div>
        <p style={{ fontSize: '11px', color: '#50535e', paddingLeft: '14px' }}>{note}</p>
      </div>

      {/* the actual list — grouped by priority, scrollable */}
      <div style={{
        overflowY: 'auto', flex: 1,
        padding: '20px 24px',
        display: 'flex', flexDirection: 'column', gap: '28px',
      }}>
        {groups.map(({ tier, items }) => (
          <div key={tier}>
            {/* section header for each priority level */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: TIER_COLORS[tier], boxShadow: `0 0 7px ${TIER_COLORS[tier]}80`,
              }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: TIER_COLORS[tier], letterSpacing: '0.1px' }}>
                {TIER_LABELS[tier]}
              </span>
              <span style={{ fontSize: '11px', color: '#2e3040' }}>· {items.length}</span>
              <div style={{ flex: 1, height: '1px', background: '#1f2230', marginLeft: '4px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {items.map(item => <DigestCard key={item.id} item={item} />)}
            </div>
          </div>
        ))}

        {digest.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#50535e', fontSize: '13px' }}>
            No signals matched for this role and phase.
          </div>
        )}
      </div>
    </div>
  )
}
