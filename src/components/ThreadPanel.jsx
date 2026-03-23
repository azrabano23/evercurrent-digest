import { SLACK_THREADS } from '../data/mockData.js'

export default function ThreadPanel() {
  return (
    <div style={{
      width: '280px',
      flexShrink: 0,
      background: '#13151c',
      borderRight: '1px solid #1f2230',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #1f2230', flexShrink: 0 }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#50535e', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Slack Threads
        </p>
        <p style={{ fontSize: '11px', color: '#2e3040', marginTop: '2px' }}>{SLACK_THREADS.length} active threads</p>
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {SLACK_THREADS.map((thread, idx) => (
          <div key={thread.id} style={{
            padding: '12px 16px',
            borderBottom: '1px solid #181b24',
          }}>
            {/* Channel */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: thread.channelColor, opacity: 0.75 }} />
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#50535e', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.2px' }}>
                {thread.channel}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#2e3040' }}>{thread.messages.length}↩</span>
            </div>

            {/* Messages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {thread.messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', gap: '8px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '5px', flexShrink: 0,
                    background: `${msg.avatarColor}18`,
                    border: `1px solid ${msg.avatarColor}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '8px', fontWeight: 700, color: msg.avatarColor,
                    marginTop: '1px',
                  }}>{msg.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'baseline', marginBottom: '1px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#9496a1' }}>{msg.author}</span>
                      <span style={{ fontSize: '9px', color: '#2e3040' }}>{msg.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#3a3d4d', lineHeight: 1.45 }}>
                      {msg.text.length > 85 ? msg.text.slice(0, 85) + '…' : msg.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stale warning */}
            {thread.note && (
              <div style={{
                marginTop: '8px',
                padding: '4px 8px',
                background: 'rgba(251,146,60,0.06)',
                borderLeft: '2px solid rgba(251,146,60,0.3)',
                borderRadius: '0 4px 4px 0',
                fontSize: '10px', color: '#7c3e12',
                lineHeight: 1.4,
              }}>
                {thread.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
