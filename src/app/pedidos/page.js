'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import OrderCard from '@/components/orders/OrderCard';
import EmptyState from '@/components/common/EmptyState';
import Loading from '@/components/common/Loading';
import { useOrders } from '@/hooks/useOrders';

export default function PedidosPage() {
  const router = useRouter();
  const { orders, loading } = useOrders();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Loading fullScreen text="Cargando pedidos..." />
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
            <div style={{ fontSize: '3rem' }}>📦</div>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: 0
            }}>
              Mis Pedidos
            </h1>
          </div>
          <p style={{
            fontSize: '1.1rem',
            opacity: '0.9',
            marginLeft: '75px'
          }}>
            Historial completo de tus compras y estado de envíos
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
        {orders.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '80px 40px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '30px' }}>📦</div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '15px'
            }}>
              No tienes pedidos aún
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.1rem',
              marginBottom: '40px',
              maxWidth: '500px',
              margin: '0 auto 40px'
            }}>
              Cuando realices tu primera compra, encontrarás aquí todos los detalles y el seguimiento de tus pedidos
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
              🛍️ Ir a Comprar
            </button>
          </div>
        ) : (
          <>
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
                <span style={{ fontSize: '2rem' }}>📊</span>
                <div>
                  <p style={{ 
                    color: '#1e40af',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    Total de pedidos realizados
                  </p>
                  <p style={{
                    color: '#1e40af',
                    fontSize: '0.95rem',
                    margin: '5px 0 0 0',
                    opacity: 0.8
                  }}>
                    Gestiona y revisa el estado de tus compras
                  </p>
                </div>
              </div>
              <div style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '10px 25px',
                borderRadius: '25px',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                {orders.length}
              </div>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '30px'
            }}>
              {orders.map((order) => (
                <OrderCard key={order.id_pedido} order={order} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
