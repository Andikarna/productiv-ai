export default function TypingIndicator() {
  return (
    <div
      className="animate-slide-up"
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '16px',
        padding: '8px 0',
      }}
    >
      {/* AI Avatar */}
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
      }}>
        ⚡
      </div>

      {/* Bubble */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '24px 24px 24px 6px',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: 'var(--shadow-md)',
        backdropFilter: 'var(--blur-md)'
      }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--color-primary-light)',
              display: 'inline-block',
              animation: `typing-dot 1s infinite ${i * 0.2}s cubic-bezier(0.4, 0, 0.2, 1)`,
              boxShadow: 'var(--glow-primary)'
            }}
          />
        ))}
      </div>
    </div>
  );
}
