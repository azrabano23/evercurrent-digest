import { SLACK_THREADS } from '../data/mockData.js'

// left panel — raw slack threads exactly as they came in
// the digest on the right is what the tool extracts from these

export default function ThreadPanel() {
  return (
    <div style={{
      width: '290px',
      flexShrink: 0,
      background: '#0f1117',
      borderRight: '1px solid #1c2030',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* panel header */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid #1c2030',
        flexShrink: 0,
        background: 'linear-gradient(180deg, #141720, #0f1117)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          {/* slack-ish color bar */}
          <div style={{
            width: '3px', height: '14px', borderRadius: '2px',
            background: 'linear-gradient(180deg, #60a5fa, #8b5cf6)',
          }} />
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9499a8', textTransform: 'uppercase', letterSpacing: '0.9px' }}>
            Slack Threads
          </p>
        </div>
        <p style={{ fontSize: '11px', color: '#2a2e40', marginTop: '4px', paddingLeft: '10px' }}>
          {SLACK_THREADS.length} active channels
        </p>
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {SLACK_THREADS.map((thread, idx) => (
          <ThreadItem key={thread.id} thread={thread} isLast={idx === SLACK_THREADS.length - 1} />
        ))}
      </div>
    </div>
  )
}

function ThreadItem({ thread, isLast }) {
  return (
    <div style={{
      padding: '14px 16px',
      borderBottom: isLast ? 'none' : '1px solid #141720',
      transition: 'background 0.12s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = '#141720'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* channel name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: thread.channelColor,
          boxShadow: `0 0 6px ${thread.channelColor}80`,
        }} />
        <span style={{
          fontSize: '10px', fontWeight: 700, color: '#9499a8',
          fontFamily: 'ui-monospace, monospace', letterSpacing: '0.3px',
        }}>
          {thread.channel}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#2a2e40' }}>
          {thread.messages.length} msg
        </span>
      </div>

      {/* messages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {thread.messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: '8px' }}>
            {/* avatar */}
            <div style={{
              width: '24px', height: '24px', borderRadius: '6px', flexShrink: 0,
              background: `${msg.avatarColor}15`,
              border: `1px solid ${msg.avatarColor}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '8px', fontWeight: 800, color: msg.avatarColor,
              marginTop: '1px',
              letterSpacing: '0px',
            }}>
              {msg.initials}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'baseline', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#9499a8' }}>{msg.author}</span>
                <span style={{ fontSize: '9px', color: '#2a2e40' }}>{msg.timestamp}</span>
              </div>
              {/* truncated preview */}
              <p style={{ fontSize: '11px', color: '#363a4e', lineHeight: 1.5 }}>
                {msg.text.length > 80 ? msg.text.slice(0, 80) + '…' : msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* stale warning — thread has gone cold */}
      {thread.note && (
        <div style={{
          marginTop: '10px',
          padding: '5px 9px',
          background: 'rgba(251,146,60,0.05)',
          borderLeft: '2px solid rgba(251,146,60,0.25)',
          borderRadius: '0 5px 5px 0',
          fontSize: '10px', color: '#7c3e12', lineHeight: 1.45,
        }}>
          {thread.note}
        </div>
      )}
    </div>
  )
}
