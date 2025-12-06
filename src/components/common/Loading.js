'use client';

export default function Loading({ fullScreen = false, text = 'Cargando...' }) {
  if (fullScreen) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '20px',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}>
            ⏳
          </div>
          <p style={{
            fontSize: '1.2rem',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    }}>
      <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>⏳ {text}</p>
    </div>
  );
}
