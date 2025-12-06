'use client';

export default function CartSummary({ cart, onCheckout }) {
  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const precio = parseFloat(item.precio_unitario || item.precio || 0);
    const cantidad = item.cantidad || 1;
    return sum + (precio * cantidad);
  }, 0);
  
  const envio = subtotal >= 100 ? 0 : 10;
  const total = subtotal + envio;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '2px solid #e5e7eb'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '25px',
        paddingBottom: '15px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        💰 Resumen del Pedido
      </h2>

      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '15px'
        }}>
          <span style={{ color: '#6b7280', fontSize: '1rem' }}>
            Subtotal ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}):
          </span>
          <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '1rem' }}>
            S/ {subtotal.toFixed(2)}
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <span style={{ color: '#6b7280', fontSize: '1rem' }}>
            Envío:
          </span>
          <span style={{ 
            fontWeight: '600', 
            color: envio === 0 ? '#10b981' : '#1f2937',
            fontSize: '1rem'
          }}>
            {envio === 0 ? '¡GRATIS!' : `S/ ${envio.toFixed(2)}`}
          </span>
        </div>

        {subtotal < 100 && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px'
          }}>
            <p style={{
              color: '#92400e',
              fontSize: '0.85rem',
              margin: 0,
              textAlign: 'center',
              fontWeight: '500'
            }}>
              💡 Agrega S/ {(100 - subtotal).toFixed(2)} más para envío gratis
            </p>
          </div>
        )}

        <div style={{
          borderTop: '2px solid #e5e7eb',
          paddingTop: '20px',
          marginTop: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ 
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              Total:
            </span>
            <span style={{ 
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#9333ea'
            }}>
              S/ {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        style={{
          width: '100%',
          padding: '16px',
          background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)',
          marginBottom: '15px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(147, 51, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(147, 51, 234, 0.3)';
        }}
      >
        ✨ Proceder al Pago
      </button>

      <div style={{
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        padding: '15px',
        textAlign: 'center'
      }}>
        <p style={{
          color: '#6b7280',
          fontSize: '0.85rem',
          margin: 0
        }}>
          🔒 Pago seguro y protegido<br />
          📦 Envío en 24-48 horas
        </p>
      </div>
    </div>
  );
}
