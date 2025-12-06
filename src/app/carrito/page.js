'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyState from '@/components/common/EmptyState';
import Loading from '@/components/common/Loading';
import { useCart } from '@/hooks/useCart';

export default function CarritoPage() {
  const router = useRouter();
  const { cart, loading, updateItem, removeItem, refreshCart } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Loading fullScreen text="Cargando carrito..." />
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
            <div style={{ fontSize: '3rem' }}>🛒</div>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: 0
            }}>
              Mi Carrito de Compras
            </h1>
          </div>
          <p style={{
            fontSize: '1.1rem',
            opacity: '0.9',
            marginLeft: '75px'
          }}>
            Revisa tus libros seleccionados antes de finalizar la compra
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
        {!cart || cart.items.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '80px 40px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '30px' }}>🛒</div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '15px'
            }}>
              Tu carrito está vacío
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.1rem',
              marginBottom: '40px',
              maxWidth: '500px',
              margin: '0 auto 40px'
            }}>
              ¡Agrega algunos libros increíbles para empezar tu colección!
            </p>
            <button
              onClick={() => router.push('/libros')}
              style={{
                background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                color: 'white',
                padding: '16px 40px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)'
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
              📚 Explorar Libros
            </button>
          </div>
        ) : (
          <>
            {/* Info Banner */}
            <div style={{
              backgroundColor: '#dbeafe',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              padding: '20px 30px',
              marginBottom: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '2rem' }}>📦</span>
                <div>
                  <p style={{ 
                    color: '#1e40af',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    Tienes {cart.items.length} {cart.items.length === 1 ? 'libro' : 'libros'} en tu carrito
                  </p>
                  <p style={{
                    color: '#1e40af',
                    fontSize: '0.95rem',
                    margin: '5px 0 0 0',
                    opacity: 0.8
                  }}>
                    Envío gratis en compras mayores a S/ 100.00
                  </p>
                </div>
              </div>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '30px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px'
              }}>
                {/* Items Column */}
                <div style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '10px'
                  }}>
                    📚 Productos en tu carrito
                  </h2>
                  {cart.items.map((item) => (
                    <CartItem
                      key={item.id_item}
                      item={item}
                      onUpdate={updateItem}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </div>
              
              {/* Summary Column */}
              <div style={{
                position: 'sticky',
                top: '100px',
                alignSelf: 'start'
              }}>
                <CartSummary cart={cart} onCheckout={handleCheckout} />
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
