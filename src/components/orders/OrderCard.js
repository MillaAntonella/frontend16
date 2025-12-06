'use client';

export default function OrderCard({ order }) {
  const getStatusColor = (estado) => {
    const colors = {
      pendiente: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
      procesando: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
      enviado: { bg: '#e0e7ff', border: '#6366f1', text: '#3730a3' },
      entregado: { bg: '#dcfce7', border: '#10b981', text: '#065f46' },
      cancelado: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }
    };
    return colors[estado] || colors.pendiente;
  };

  const getStatusIcon = (estado) => {
    const icons = {
      pendiente: '⏳',
      procesando: '🔄',
      enviado: '🚚',
      entregado: '✅',
      cancelado: '❌'
    };
    return icons[estado] || '📦';
  };

  const statusColor = getStatusColor(order.estado);
  const formatDate = (date) => new Date(date).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: '2px solid #e5e7eb'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        padding: '20px',
        borderBottom: '2px solid #d1d5db'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span style={{
            fontSize: '0.85rem',
            color: '#6b7280',
            fontWeight: '600'
          }}>
            Pedido #{order.numero_pedido}
          </span>
          <span style={{
            backgroundColor: statusColor.bg,
            color: statusColor.text,
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            border: `2px solid ${statusColor.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {getStatusIcon(order.estado)} {order.estado.toUpperCase()}
          </span>
        </div>
        <p style={{
          fontSize: '0.9rem',
          color: '#9ca3af',
          margin: 0
        }}>
          📅 {formatDate(order.fecha_pedido)}
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div>
            <p style={{
              fontSize: '0.85rem',
              color: '#6b7280',
              margin: '0 0 5px 0'
            }}>
              Total del pedido
            </p>
            <p style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0
            }}>
              S/ {parseFloat(order.total).toFixed(2)}
            </p>
          </div>
          <div style={{
            textAlign: 'right'
          }}>
            <p style={{
              fontSize: '0.85rem',
              color: '#6b7280',
              margin: '0 0 5px 0'
            }}>
              Método de pago
            </p>
            <p style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#374151',
              margin: 0,
              textTransform: 'capitalize'
            }}>
              💳 {order.metodo_pago}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <p style={{
            fontSize: '0.85rem',
            color: '#6b7280',
            marginBottom: '8px',
            fontWeight: '600'
          }}>
            📍 Dirección de envío:
          </p>
          <p style={{
            fontSize: '0.9rem',
            color: '#374151',
            margin: 0,
            lineHeight: '1.5'
          }}>
            {order.direccion_envio}<br />
            {order.ciudad_envio}, {order.codigo_postal_envio}
          </p>
        </div>

        {order.notas && (
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '12px',
            borderRadius: '8px',
            marginTop: '15px'
          }}>
            <p style={{
              fontSize: '0.85rem',
              color: '#6b7280',
              marginBottom: '5px',
              fontWeight: '600'
            }}>
              📝 Notas:
            </p>
            <p style={{
              fontSize: '0.9rem',
              color: '#374151',
              margin: 0,
              fontStyle: 'italic'
            }}>
              {order.notas}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '15px 20px',
        backgroundColor: '#f9fafb',
        borderTop: '2px solid #e5e7eb',
        display: 'flex',
        gap: '10px'
      }}>
        <button style={{
          flex: 1,
          padding: '10px',
          backgroundColor: '#9333ea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '0.9rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9333ea'}>
          👁️ Ver detalles
        </button>
        {order.estado === 'entregado' && (
          <button style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}>
            ⭐ Calificar
          </button>
        )}
      </div>
    </div>
  );
}
