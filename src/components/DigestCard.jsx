import { useState } from 'react'
import ImpactChain from './ImpactChain.jsx'
import { SIGNAL_META } from '../data/mockData.js'

// color palette per priority level
const PC = {
  CRITICAL: { color: '#f87171', bg: 'rgba(248,113,113,0.07)', border: 'rgba(248,113,113,0.18)', dot: '#ef4444', glow: 'rgba(248,113,113,0.12)' },
  HIGH:     { color: '#fb923c', bg: 'rgba(251,146,60,0.07)',  border: 'rgba(251,146,60,0.18)',  dot: '#f97316', glow: 'rgba(251,146,60,0.10)'  },
  MEDIUM:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.06)',  border: 'rgba(251,191,36,0.16)',  dot: '#eab308', glow: 'rgba(251,191,36,0.08)'  },
  LOW:      { color: '#4ade80', bg: 'rgba(74,222,128,0.06)',  border: 'rgba(74,222,128,0.16)',  dot: '#22c55e', glow: 'rgba(74,222,128,0.08)'  },
}

// one card per signal — collapsed by default, expands on click
export default function DigestCard({ item }) {
  const [open, setOpen]           = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [hovered, setHovered]     = useState(false)

  const meta = SIGNAL_META[item.type] ?? { label: item.type, color: '#9499a8' }
  const pc   = PC[item.priority] ?? PC.LOW
  const bd   = item.breakdown

  return (
    <div style={{
      borderRadius: '10px',
      border: `1px solid ${open ? pc.border : hovered ? '#242840' : '#1c2030'}`,
      background: open
        ? `linear-gradient(135deg, #141720, #0f1117)`
        : hovered
          ? '#111420'
          : '#0f1117',
      overflow: 'hidden',
      transition: 'all 0.18s ease',
      boxShadow: open
        ? `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${pc.glow}`
        : hovered
          ? '0 4px 16px rgba(0,0,0,0.25)'
          : 'none',
    }}>

      {/* collapsed row */}
      <div
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
      >
        {/* priority dot */}
        <div style={{ paddingTop: '5px', flexShrink: 0 }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: pc.dot,
            boxShadow: `0 0 8px ${pc.dot}, 0 0 16px ${pc.glow}`,
          }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '13px', fontWeight: 600,
            color: '#eceef5', lineHeight: 1.4,
            marginBottom: '5px', letterSpacing: '-0.2px',
          }}>
            {item.title}
          </p>
          <p style={{ fontSize: '11.5px', color: '#9499a8', lineHeight: 1.6 }}>
            {item.summary}
          </p>

          {/* tags row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '10px', flexWrap: 'wrap' }}>
            {/* signal type badge */}
            <span style={{
              fontSize: '10px', fontWeight: 600, color: meta.color,
              background: `${meta.color}10`,
              border: `1px solid ${meta.color}22`,
              borderRadius: '5px', padding: '2px 7px',
              letterSpacing: '0.1px',
            }}>
              {meta.label}
            </span>

            <Dot />

            {/* channel */}
            <span style={{ fontSize: '10px', color: '#4e5264', fontFamily: 'ui-monospace, monospace' }}>
              {item.sourceChannel}
            </span>

            <Dot />

            {/* how old it is */}
            <AgeTag hours={item.hoursOld} />

            {/* avatars of people involved */}
            {item.actorInitials?.length > 0 && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                {item.actorInitials.map(([init, color]) => (
                  <div key={init} style={{
                    width: '22px', height: '22px', borderRadius: '5px',
                    background: `${color}12`, border: `1px solid ${color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '8px', fontWeight: 800, color,
                    letterSpacing: '0px',
                  }}>{init}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* right side — priority label, score, arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '7px', flexShrink: 0, paddingTop: '1px' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.2px',
            color: pc.color,
            background: pc.bg,
            border: `1px solid ${pc.border}`,
            borderRadius: '5px', padding: '2px 8px',
          }}>
            {item.priority}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#2a2e40', fontFamily: 'ui-monospace, monospace' }}>
              {item.score.toFixed(2)}
            </span>
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{
                transition: 'transform 0.18s ease',
                transform: open ? 'rotate(90deg)' : 'none',
                color: open ? '#4e5264' : '#2a2e40',
              }}
            >
              <path d="M4 2.5L8.5 6L4 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* expanded section */}
      {open && (
        <div style={{ borderTop: `1px solid ${pc.border}30` }}>
          <div style={{ padding: '18px 20px 20px 36px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* why it matters to you specifically */}
            <div>
              <SectionLabel>Why this matters to you</SectionLabel>
              <p style={{
                fontSize: '12.5px', color: '#9499a8', lineHeight: 1.75, marginTop: '9px',
                borderLeft: `2px solid ${pc.dot}35`,
                paddingLeft: '13px',
              }}>
                {item.whyItMattersForRole}
              </p>
            </div>

            {/* domino chain — how this cascades downstream */}
            <ImpactChain chain={item.impactChain} />

            {/* score breakdown — shows the math behind the ranking */}
            <div>
              <button
                onClick={() => setShowScore(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontSize: '10px', fontWeight: 700, color: showScore ? '#4e5264' : '#2a2e40',
                  textTransform: 'uppercase', letterSpacing: '0.7px', padding: 0,
                  transition: 'color 0.15s',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                  style={{ transition: 'transform 0.18s ease', transform: showScore ? 'rotate(90deg)' : 'none' }}>
                  <path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Score breakdown
              </button>

              {showScore && (
                <div style={{ marginTop: '12px' }}>
                  {/* 6 factor boxes */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px', marginBottom: '10px' }}>
                    {[
                      ['Role Wt',  bd.roleWeight ],
                      ['Phase Wt', bd.phaseWeight],
                      ['Recency',  bd.recency    ],
                      ['Urgency',  bd.urgency    ],
                      ['Dep',      bd.depImpact  ],
                      ['CF Reach', bd.cfReach    ],
                    ].map(([k, v]) => (
                      <div key={k} style={{
                        background: '#141720',
                        border: '1px solid #1c2030',
                        borderRadius: '7px', padding: '8px 4px', textAlign: 'center',
                      }}>
                        <p style={{
                          fontSize: '12px', fontWeight: 700,
                          fontFamily: 'ui-monospace, monospace',
                          color: '#9499a8',
                          letterSpacing: '-0.3px',
                        }}>{v}</p>
                        <p style={{
                          fontSize: '9px', color: '#2a2e40',
                          textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '3px',
                        }}>{k}</p>
                      </div>
                    ))}
                  </div>
                  {/* the full equation */}
                  <p style={{ fontSize: '10px', color: '#2a2e40', fontFamily: 'ui-monospace, monospace', lineHeight: 1.6 }}>
                    {bd.roleWeight} × {bd.phaseWeight} × {bd.recency} × {bd.urgency} × {bd.depImpact} × {bd.cfReach}
                    {' = '}<span style={{ color: pc.dot, fontWeight: 700 }}>{item.score.toFixed(3)}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: '10px', fontWeight: 700, color: '#4e5264', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
      {children}
    </p>
  )
}

function Dot() {
  return (
    <span style={{
      width: '2px', height: '2px', borderRadius: '50%',
      background: '#242840', flexShrink: 0, display: 'inline-block',
    }} />
  )
}

// turns orange if nobody has updated the thread in 12+ hours
function AgeTag({ hours }) {
  const stale = hours > 12
  const label = hours < 1
    ? 'just now'
    : hours < 24
      ? `${hours}h ago`
      : `${Math.floor(hours / 24)}d ago`

  return (
    <span style={{
      fontSize: '10px',
      color: stale ? '#b45309' : '#4e5264',
      background: stale ? 'rgba(180,83,9,0.1)' : 'transparent',
      border: stale ? '1px solid rgba(180,83,9,0.2)' : '1px solid transparent',
      padding: '1px 5px',
      borderRadius: '4px',
    }}>
      {stale ? `⚠ ${label}` : label}
    </span>
  )
}
