import { format } from 'date-fns';

export default function MessageBubble({ message, delay = 0 }) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  const time = message.timestamp
    ? format(new Date(message.timestamp), 'HH:mm:ss')
    : '';

  return (
    <div
      className="animate-slide-up"
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: '16px',
        maxWidth: '100%',
        animationDelay: `${delay * 0.05}s`
      }}
    >
      {/* Avatar AI */}
      {!isUser && (
        <div className="animate-scale-in" style={{
          width: '36px',
          height: '36px',
          borderRadius: '12px',
          background: 'var(--gradient-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          flexShrink: 0,
          boxShadow: 'var(--glow-primary)',
          border: '1px solid rgba(255,255,255,0.3)',
          marginBottom: '20px' // Align slightly above time
        }}>
          ⚡
        </div>
      )}

      {/* Bubble Container */}
      <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap: '8px' }}>
        
        {/* The Text Bubble */}
        <div
          style={{
            padding: '16px 24px',
            borderRadius: isUser ? '24px 24px 6px 24px' : '24px 24px 24px 6px',
            background: isUser
              ? 'rgba(138, 43, 226, 0.15)'
              : isError
              ? 'rgba(255, 42, 85, 0.1)'
              : 'var(--color-surface)',
            backdropFilter: 'var(--blur-md)',
            border: isUser
              ? '1px solid rgba(138, 43, 226, 0.4)'
              : isError
              ? '1px solid rgba(255, 42, 85, 0.4)'
              : '1px solid var(--color-border)',
            color: isUser ? '#fff' : isError ? 'var(--color-danger)' : 'var(--color-text)',
            fontSize: '1rem',
            lineHeight: '1.6',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            boxShadow: isUser ? 'var(--glow-primary)' : 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle noise texture on AI bubbles for that 2026 feel */}
          {!isUser && !isError && (
             <div style={{
               position: 'absolute', inset: 0, opacity: 0.05, mixBlendMode: 'overlay',
               backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noiseFilter\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.65\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noiseFilter)\\"/%3E%3C/svg%3E")'
             }}/>
          )}
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {message.image && (
              <img 
                src={`data:${message.image.mimeType};base64,${message.image.data}`} 
                alt="Uploaded by user" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  objectFit: 'contain',
                  alignSelf: isUser ? 'flex-end' : 'flex-start'
                }} 
              />
            )}
            <div style={{ textAlign: isUser ? 'right' : 'left' }}>
              {message.content}
            </div>
          </div>
        </div>

        {/* Timestamp + metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px' }}>
          {message.metadata?.taskDetected && (
            <span className="badge badge-success animate-scale-in" style={{ fontSize: '0.65rem' }}>
              ✓ Matrix Updated
            </span>
          )}
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', fontFamily: 'var(--font-mono)' }}>{time}</span>
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="animate-scale-in" style={{
          width: '36px',
          height: '36px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text)',
          fontWeight: '700',
          fontSize: '0.9rem',
          flexShrink: 0,
          backdropFilter: 'var(--blur-sm)',
          marginBottom: '20px'
        }}>
           U
        </div>
      )}
    </div>
  );
}
