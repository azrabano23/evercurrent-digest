const STYLE = {
  blocker:       { color: '#f87171', bg: 'rgba(248,113,113,0.07)', border: 'rgba(248,113,113,0.16)' },
  risk:          { color: '#fbbf24', bg: 'rgba(251,191,36,0.07)',  border: 'rgba(251,191,36,0.16)'  },
  milestone:     { color: '#fb923c', bg: 'rgba(251,146,60,0.07)',  border: 'rgba(251,146,60,0.16)'  },
  dependency:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.07)',  border: 'rgba(96,165,250,0.16)'  },
  decision:      { color: '#c084fc', bg: 'rgba(192,132,252,0.07)', border: 'rgba(192,132,252,0.16)' },
  open_question: { color: '#60a5fa', bg: 'rgba(96,165,250,0.07)',  border: 'rgba(96,165,250,0.16)'  },
}

// domino chain — shows how one problem turns into bigger problems downstream
// e.g. U7 broken → firmware blocked → sensor tests delayed → DVT slips

export default function ImpactChain({ chain }) {
  if (!chain?.length) return null

  return (
    <div>
      <p style={{
        fontSize: '10px', fontWeight: 700, color: '#4e5264',
        textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px',
      }}>
        Impact Chain
      </p>

      <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
        {chain.map((node, i) => {
          const s = STYLE[node.type] ?? STYLE.dependency
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {/* node box */}
                <div style={{
                  padding: '5px 10px', borderRadius: '6px',
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  fontSize: '11px', fontWeight: 600,
                  color: s.color, whiteSpace: 'nowrap',
                  letterSpacing: '-0.1px',
                }}>
                  {node.label}
                </div>
                {/* who owns this step */}
                {node.owner && (
                  <span style={{ fontSize: '9px', color: '#2a2e40', paddingLeft: '3px' }}>{node.owner}</span>
                )}
              </div>
              {/* arrow between nodes */}
              {i < chain.length - 1 && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                  style={{ flexShrink: 0, marginBottom: '12px', opacity: 0.4 }}>
                  <path d="M3 8h8M8 5l3 3-3 3" stroke="#60a5fa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
