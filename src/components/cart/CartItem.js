'use client';

export default function CartItem({ item, onUpdate, onRemove }) {
  // Manejar diferentes estructuras de datos
  const libro = item.libro || item;
  const cantidad = item.cantidad || 1;
  const precioUnitario = parseFloat(item.precio_unitario || item.precio || 0);
  const stock = libro.stock || 0;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= stock) {
      onUpdate(item.id_item || item.id, newQuantity);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      border: '2px solid #e5e7eb',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'}
    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr auto',
        gap: '20px',
        alignItems: 'center'
      }}>
        {/* Image */}
        <div style={{
          width: '120px',
          height: '160px',
          background: 'linear-gradient(135deg, #e9d5ff 0%, #fbcfe8 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem'
        }}>
          📚
        </div>

        {/* Info */}
        <div>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px',
            lineHeight: '1.3'
          }}>
            {libro.titulo || 'Libro sin título'}
          </h3>
          <p style={{
            color: '#6b7280',
            fontSize: '0.95rem',
            marginBottom: '12px'
          }}>
            Por {libro.autor || 'Autor desconocido'}
          </p>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#9333ea'
            }}>
              S/ {precioUnitario.toFixed(2)}
            </span>
            <span style={{
              fontSize: '0.9rem',
              color: '#6b7280'
            }}>
              Stock: {stock}
            </span>
          </div>

          {/* Quantity Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <button
              onClick={() => handleQuantityChange(cantidad - 1)}
              disabled={cantidad <= 1}
              style={{
                width: '35px',
                height: '35px',
                borderRadius: '8px',
                border: '2px solid #e5e7eb',
                backgroundColor: cantidad <= 1 ? '#f3f4f6' : 'white',
                color: cantidad <= 1 ? '#9ca3af' : '#1f2937',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: cantidad <= 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (cantidad > 1) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (cantidad > 1) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              −
            </button>
            
            <span style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#1f2937',
              minWidth: '30px',
              textAlign: 'center'
            }}>
              {cantidad}
            </span>
            
            <button
              onClick={() => handleQuantityChange(cantidad + 1)}
              disabled={cantidad >= stock}
              style={{
                width: '35px',
                height: '35px',
                borderRadius: '8px',
                border: '2px solid #e5e7eb',
                backgroundColor: cantidad >= stock ? '#f3f4f6' : 'white',
                color: cantidad >= stock ? '#9ca3af' : '#1f2937',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: cantidad >= stock ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (cantidad < stock) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (cantidad < stock) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '15px'
        }}>
          <div style={{
            textAlign: 'right'
          }}>
            <p style={{
              fontSize: '0.85rem',
              color: '#6b7280',
              marginBottom: '5px'
            }}>
              Subtotal
            </p>
            <p style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0
            }}>
              S/ {(precioUnitario * cantidad).toFixed(2)}
            </p>
          </div>
          
          <button
            onClick={() => onRemove(item.id_item || item.id)}
            style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '2px solid #fecaca',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fecaca';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
