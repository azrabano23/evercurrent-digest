// color for each type of node in the chain
const STYLE = {
  blocker:       { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.18)' },
  risk:          { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.18)'  },
  milestone:     { color: '#fb923c', bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.18)'  },
  dependency:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.18)'  },
  decision:      { color: '#c084fc', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.18)' },
  open_question: { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.18)'  },
}

// this shows the domino effect — how one problem causes another
// like: broken power rail → firmware can't boot → sensor tests delayed → DVT slips
// it's the answer to "ok but why should I actually care?"

export default function ImpactChain({ chain }) {
  if (!chain?.length) return null

  return (
    <div>
      <p style={{
        fontSize: '10px', fontWeight: 700, color: '#50535e',
        textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '10px',
      }}>
        Impact Chain
      </p>

      {/* boxes connected by arrows */}
      <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: '3px' }}>
        {chain.map((node, i) => {
          const s = STYLE[node.type] ?? STYLE.dependency
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{
                  padding: '4px 9px', borderRadius: '5px',
                  background: s.bg, border: `1px solid ${s.border}`,
                  fontSize: '11px', fontWeight: 500, color: s.color, whiteSpace: 'nowrap',
                }}>
                  {node.label}
                </div>
                {/* who's responsible for this step */}
                {node.owner && (
                  <span style={{ fontSize: '9px', color: '#50535e', paddingLeft: '2px' }}>{node.owner}</span>
                )}
              </div>
              {/* don't put an arrow after the last box */}
              {i < chain.length - 1 && (
                <span style={{ fontSize: '14px', color: '#262a38', marginBottom: '12px', flexShrink: 0 }}>→</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
