import { useState } from 'react'
import ImpactChain from './ImpactChain.jsx'
import { SIGNAL_META } from '../data/mockData.js'

// colors for each priority level — background, border, and the dot
const PC = {
  CRITICAL: { color: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.22)', dot: '#ef4444' },
  HIGH:     { color: '#fb923c', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.22)',  dot: '#f97316' },
  MEDIUM:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)',   dot: '#eab308' },
  LOW:      { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.2)',   dot: '#22c55e' },
}

export default function DigestCard({ item }) {
  // open = card is expanded, showScore = score breakdown is visible
  const [open, setOpen]           = useState(false)
  const [showScore, setShowScore] = useState(false)

  const meta = SIGNAL_META[item.type] ?? { label: item.type, color: '#9496a1' }
  const pc   = PC[item.priority]   ?? PC.LOW
  const bd   = item.breakdown

  return (
    <div style={{
      borderRadius: '8px',
      border: `1px solid ${open ? '#262a38' : '#1f2230'}`,
      background: open ? '#181b24' : '#13151c',
      overflow: 'hidden',
      transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
      boxShadow: open ? '0 4px 24px rgba(0,0,0,0.25)' : 'none',
    }}>

      {/* collapsed view — click to expand */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
        onMouseEnter={e => { if (!open) e.currentTarget.parentElement.style.background = '#161920' }}
        onMouseLeave={e => { if (!open) e.currentTarget.parentElement.style.background = '#13151c' }}
      >
        {/* priority dot — color tells you at a glance how urgent this is */}
        <div style={{ paddingTop: '5px', flexShrink: 0 }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: pc.dot, boxShadow: `0 0 8px ${pc.dot}70`,
          }} />
        </div>

        {/* title, summary, and meta row */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '13px', fontWeight: 600,
            color: '#e8eaf0', lineHeight: 1.38,
            marginBottom: '4px', letterSpacing: '-0.15px',
          }}>
            {item.title}
          </p>
          <p style={{ fontSize: '12px', color: '#9496a1', lineHeight: 1.55 }}>
            {item.summary}
          </p>

          {/* signal type tag, source channel, age, and who's involved */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '9px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '10px', fontWeight: 500, color: meta.color,
              background: `${meta.color}12`, border: `1px solid ${meta.color}20`,
              borderRadius: '4px', padding: '1px 6px',
            }}>
              {meta.label}
            </span>
            <Dot />
            <span style={{ fontSize: '10px', color: '#50535e', fontFamily: 'ui-monospace, monospace' }}>
              {item.sourceChannel}
            </span>
            <Dot />
            <AgeTag hours={item.hoursOld} />

            {/* avatar initials for people involved in the thread */}
            {item.actorInitials?.length > 0 && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '3px' }}>
                {item.actorInitials.map(([init, color]) => (
                  <div key={init} style={{
                    width: '20px', height: '20px', borderRadius: '4px',
                    background: `${color}18`, border: `1px solid ${color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '8px', fontWeight: 700, color,
                  }}>{init}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* priority label + raw score + expand arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0, paddingTop: '1px' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700,
            color: pc.color, background: pc.bg, border: `1px solid ${pc.border}`,
            borderRadius: '4px', padding: '2px 7px', letterSpacing: '0.1px',
          }}>
            {item.priority}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* raw score — smaller number = less relevant */}
            <span style={{ fontSize: '10px', color: '#2e3040', fontFamily: 'ui-monospace, monospace' }}>
              {item.score.toFixed(2)}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{ transition: 'transform 0.15s', transform: open ? 'rotate(90deg)' : 'none', color: '#50535e' }}>
              <path d="M4 2.5L8.5 6L4 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* expanded detail — why it matters + impact chain + score breakdown */}
      {open && (
        <div style={{ borderTop: '1px solid #1f2230' }}>
          <div style={{ padding: '18px 18px 18px 36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* role-specific explanation — different for every role */}
            <div>
              <SectionLabel>Why this matters to you</SectionLabel>
              <p style={{
                fontSize: '12.5px', color: '#a8aab6', lineHeight: 1.7, marginTop: '8px',
                borderLeft: `2px solid ${pc.dot}40`, paddingLeft: '12px',
              }}>
                {item.whyItMattersForRole}
              </p>
            </div>

            {/* how this signal cascades through the program */}
            <ImpactChain chain={item.impactChain} />

            {/* score breakdown — shows exactly what went into the number */}
            <div>
              <button
                onClick={() => setShowScore(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontSize: '10px', fontWeight: 700, color: '#50535e',
                  textTransform: 'uppercase', letterSpacing: '0.6px', padding: 0,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                  style={{ transition: 'transform 0.15s', transform: showScore ? 'rotate(90deg)' : 'none' }}>
                  <path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                Score breakdown
              </button>

              {showScore && (
                <div style={{ marginTop: '12px' }}>
                  {/* each factor that went into the score, side by side */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '10px' }}>
                    {[
                      ['Role Wt',  bd.roleWeight ],
                      ['Phase Wt', bd.phaseWeight],
                      ['Recency',  bd.recency    ],
                      ['Urgency',  bd.urgency    ],
                      ['Dep',      bd.depImpact  ],
                      ['CF Reach', bd.cfReach    ],
                    ].map(([k, v]) => (
                      <div key={k} style={{
                        background: '#1e2130', border: '1px solid #262a38',
                        borderRadius: '6px', padding: '7px 4px', textAlign: 'center',
                      }}>
                        <p style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'ui-monospace, monospace', color: '#9496a1' }}>{v}</p>
                        <p style={{ fontSize: '9px', color: '#50535e', textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: '3px' }}>{k}</p>
                      </div>
                    ))}
                  </div>
                  {/* the full formula written out so you can see the math */}
                  <p style={{ fontSize: '10px', color: '#2e3040', fontFamily: 'ui-monospace, monospace' }}>
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

// small helpers below — not worth their own files

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: '10px', fontWeight: 700, color: '#50535e', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
      {children}
    </p>
  )
}

// tiny separator dot between meta items
function Dot() {
  return (
    <span style={{
      width: '2px', height: '2px', borderRadius: '50%',
      background: '#2e3040', flexShrink: 0, display: 'inline-block',
    }} />
  )
}

// shows how old the signal is — highlights in orange if it's been sitting > 12 hours
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
      color: stale ? '#92400e' : '#50535e',
      background: stale ? 'rgba(146,64,14,0.12)' : 'transparent',
      padding: stale ? '1px 5px' : '0',
      borderRadius: '3px',
    }}>
      {stale ? `⚠ ${label}` : label}
    </span>
  )
}
