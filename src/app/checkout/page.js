'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading } = useCart();
  const { createOrder } = useOrders();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    direccion_envio: '',
    ciudad_envio: '',
    codigo_postal_envio: '',
    telefono_contacto: '',
    metodo_pago: 'tarjeta',
    notas: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    if (!cartLoading && (!cart || !cart.items || cart.items.length === 0)) {
      router.push('/carrito');
    }
  }, [cart, cartLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting order with form data:', formData);
      const result = await createOrder(formData);
      
      console.log('Order creation result:', result);
      
      if (result.success) {
        // Success notification
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 30px 50px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          z-index: 10000;
          text-align: center;
          font-size: 1.2rem;
          font-weight: bold;
        `;
        successDiv.innerHTML = '✅ ¡Pedido realizado exitosamente!<br/>Redirigiendo...';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
          document.body.removeChild(successDiv);
          router.push('/pedidos');
        }, 2000);
      } else {
        // Error notification con mensaje mejorado
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          padding: 30px 50px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          z-index: 10000;
          text-align: center;
          max-width: 600px;
        `;
        
        const errorMessage = result.message === 'Error en el servidor. Por favor, contacta al administrador o intenta más tarde.'
          ? '⚠️ Error en el servidor al procesar el pedido.<br/><br/>Esto puede deberse a un problema de configuración en la base de datos.<br/><br/>Por favor, contacta al administrador del sistema.'
          : result.message || 'Por favor, intenta nuevamente';
          
        errorDiv.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 15px;">❌</div>
          <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 15px;">
            Error al procesar el pedido
          </div>
          <div style="font-size: 0.95rem; opacity: 0.95; line-height: 1.6;">
            ${errorMessage}
          </div>
          <button onclick="this.parentElement.remove()" style="
            margin-top: 25px;
            padding: 12px 35px;
            background: white;
            color: #ef4444;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            font-size: 1rem;
          ">
            Entendido
          </button>
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
          if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
          }
        }, 8000);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: 'white',
        padding: 30px 50px;
        borderRadius: 16px;
        boxShadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        textAlign: center;
      `;
      errorDiv.innerHTML = '❌ Error inesperado al procesar el pedido';
      document.body.appendChild(errorDiv);
      
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart?.items?.reduce((sum, item) => {
    const precio = parseFloat(item.precio_unitario || item.precio || 0);
    const cantidad = item.cantidad || 1;
    return sum + (precio * cantidad);
  }, 0) || 0;

  const impuestos = subtotal * 0.18;
  const envio = subtotal > 100 ? 0 : 10;
  const total = subtotal + impuestos + envio;

  if (cartLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <p style={{ fontSize: '1.5rem', color: '#6b7280' }}>⏳ Cargando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#f9fafb' 
    }}>
      <Navbar />
      
      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
        color: 'white',
        padding: '60px 0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '10px'
          }}>
            <div style={{ fontSize: '3rem' }}>💳</div>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: 0
            }}>
              Finalizar Compra
            </h1>
          </div>
          <p style={{
            fontSize: '1.1rem',
            opacity: '0.9',
            marginLeft: '75px'
          }}>
            Solo un paso más para completar tu pedido
          </p>
        </div>
      </div>

      <main style={{ 
        flex: 1,
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '60px 20px'
      }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {/* Formulario */}
          <div style={{ gridColumn: 'span 2' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Información de Envío */}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  📍 Información de Envío
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Dirección completa *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.direccion_envio}
                      onChange={(e) => setFormData({...formData, direccion_envio: e.target.value})}
                      placeholder="Av. Principal 123, Dpto. 456"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#9333ea';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.ciudad_envio}
                        onChange={(e) => setFormData({...formData, ciudad_envio: e.target.value})}
                        placeholder="Lima"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#9333ea';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.codigo_postal_envio}
                        onChange={(e) => setFormData({...formData, codigo_postal_envio: e.target.value})}
                        placeholder="15001"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#9333ea';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Teléfono de Contacto *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telefono_contacto}
                      onChange={(e) => setFormData({...formData, telefono_contacto: e.target.value})}
                      placeholder="999 999 999"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#9333ea';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Método de Pago */}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  💰 Método de Pago
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {[
                    { value: 'tarjeta', icon: '💳', label: 'Tarjeta de Crédito/Débito' },
                    { value: 'paypal', icon: '🅿️', label: 'PayPal' },
                    { value: 'transferencia', icon: '🏦', label: 'Transferencia Bancaria' },
                    { value: 'efectivo', icon: '💵', label: 'Pago Contra Entrega' }
                  ].map((method) => (
                    <label 
                      key={method.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        border: formData.metodo_pago === method.value ? '2px solid #9333ea' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: formData.metodo_pago === method.value ? '#f3e8ff' : 'white'
                      }}
                      onMouseEnter={(e) => {
                        if (formData.metodo_pago !== method.value) {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (formData.metodo_pago !== method.value) {
                          e.currentTarget.style.backgroundColor = 'white';
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name="metodo_pago"
                        value={method.value}
                        checked={formData.metodo_pago === method.value}
                        onChange={(e) => setFormData({...formData, metodo_pago: e.target.value})}
                        style={{ marginRight: '15px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>{method.icon}</span>
                      <span style={{ fontWeight: '600', fontSize: '1rem', color: '#1f2937' }}>
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notas Adicionales */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '2px solid #e5e7eb'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📝 Notas adicionales (opcional)
                </label>
                <textarea
                  rows="4"
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  placeholder="Instrucciones especiales de entrega, horarios preferidos, etc..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#9333ea';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              position: 'sticky',
              top: '100px'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '25px',
                paddingBottom: '15px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                📊 Resumen del Pedido
              </h2>
              
              <div style={{ marginBottom: '25px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '15px',
                  fontSize: '1rem'
                }}>
                  <span style={{ color: '#6b7280' }}>Subtotal:</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>
                    S/ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '15px',
                  fontSize: '1rem'
                }}>
                  <span style={{ color: '#6b7280' }}>Impuestos (18%):</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>
                    S/ {impuestos.toFixed(2)}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  fontSize: '1rem'
                }}>
                  <span style={{ color: '#6b7280' }}>Envío:</span>
                  <span style={{ 
                    fontWeight: '600', 
                    color: envio === 0 ? '#10b981' : '#1f2937'
                  }}>
                    {envio === 0 ? '¡GRATIS!' : `S/ ${envio.toFixed(2)}`}
                  </span>
                </div>

                <div style={{
                  borderTop: '2px solid #e5e7eb',
                  paddingTop: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      fontSize: '1.3rem',
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
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)',
                  marginBottom: '20px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(147, 51, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(147, 51, 234, 0.3)';
                }}
              >
                {loading ? '⏳ Procesando...' : '🛍️ Confirmar Pedido'}
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
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  🔒 Tu información está protegida<br />
                  📦 Envío en 24-48 horas<br />
                  ✅ Garantía de satisfacción
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
