'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminStats from '@/components/admin/AdminStats';
import { ordersAPI } from '@/lib/api/orders';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchPedidosRecientes();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await ordersAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidosRecientes = async () => {
    try {
      const response = await ordersAPI.getAll();
      if (response.success) {
        // Tomar los 5 pedidos más recientes
        const recientes = (response.data || [])
          .sort((a, b) => new Date(b.fecha_pedido) - new Date(a.fecha_pedido))
          .slice(0, 5);
        setPedidosRecientes(recientes);
      }
    } catch (error) {
      console.error('Error al cargar pedidos recientes:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '1.125rem',
        color: '#6b7280'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div>Cargando dashboard...</div>
        </div>
      </div>
    );
  }

  const accesosRapidos = [
    { icon: '📚', title: 'Agregar Libro', desc: 'Añadir nuevo libro al catálogo', href: '/admin/libros/nuevo', color: '#3b82f6' },
    { icon: '📦', title: 'Ver Pedidos', desc: 'Gestionar pedidos pendientes', href: '/admin/pedidos', color: '#9333ea' },
    { icon: '👥', title: 'Usuarios', desc: 'Administrar usuarios', href: '/admin/usuarios', color: '#10b981' },
    { icon: '📈', title: 'Estadísticas', desc: 'Ver reportes detallados', href: '/admin/estadisticas', color: '#f59e0b' }
  ];

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: '#fbbf24',
      procesando: '#3b82f6',
      enviado: '#10b981',
      entregado: '#22c55e',
      cancelado: '#ef4444'
    };
    return colores[estado] || '#6b7280';
  };

  return (
    <div style={{ paddingBottom: '48px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          📊 Dashboard de Administración
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Bienvenido, aquí está el resumen de tu tienda de libros
        </p>
      </div>

      {/* Stats Cards */}
      <AdminStats stats={stats} />

      {/* Accesos Rápidos */}
      <div style={{ marginTop: '32px', marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#1f2937'
        }}>
          ⚡ Accesos Rápidos
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {accesosRapidos.map((item, index) => (
            <div
              key={index}
              onClick={() => router.push(item.href)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                border: '2px solid #e5e7eb',
                transition: 'all 0.3s ease',
                transform: hoveredCard === index ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hoveredCard === index 
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${item.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '16px'
              }}>
                {item.icon}
              </div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: '1.5'
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Layout de dos columnas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        marginTop: '32px'
      }}>
        {/* Pedidos Recientes */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          border: '2px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              🕒 Pedidos Recientes
            </h2>
            <button
              onClick={() => router.push('/admin/pedidos')}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Ver Todos
            </button>
          </div>

          {pedidosRecientes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
              <p>No hay pedidos recientes</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pedidosRecientes.map((pedido) => (
                <div
                  key={pedido.id_pedido}
                  onClick={() => router.push('/admin/pedidos')}
                  style={{
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.borderColor = '#9333ea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                        {pedido.numero_pedido}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {pedido.usuario_nombre}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'white',
                      background: getEstadoColor(pedido.estado),
                      textTransform: 'capitalize'
                    }}>
                      {pedido.estado}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES')}
                    </span>
                    <span style={{ fontWeight: '700', color: '#059669', fontSize: '16px' }}>
                      S/ {parseFloat(pedido.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alertas y Notificaciones */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          border: '2px solid #e5e7eb'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#1f2937'
          }}>
            🔔 Alertas y Notificaciones
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Alerta de pedidos pendientes */}
            {stats?.pendientes > 0 && (
              <div style={{
                padding: '16px',
                background: '#fef3c7',
                borderLeft: '4px solid #fbbf24',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '24px' }}>⏳</div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>
                      {stats.pendientes} pedido{stats.pendientes !== 1 ? 's' : ''} pendiente{stats.pendientes !== 1 ? 's' : ''}
                    </div>
                    <div style={{ fontSize: '14px', color: '#78350f' }}>
                      Requiere{stats.pendientes !== 1 ? 'n' : ''} atención inmediata
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Alerta de pedidos en procesamiento */}
            {stats?.procesando > 0 && (
              <div style={{
                padding: '16px',
                background: '#dbeafe',
                borderLeft: '4px solid #3b82f6',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '24px' }}>⚙️</div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>
                      {stats.procesando} pedido{stats.procesando !== 1 ? 's' : ''} en proceso
                    </div>
                    <div style={{ fontSize: '14px', color: '#1e3a8a' }}>
                      Preparando para envío
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Alerta de éxito */}
            {stats?.entregados > 0 && (
              <div style={{
                padding: '16px',
                background: '#dcfce7',
                borderLeft: '4px solid #22c55e',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '24px' }}>✅</div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#166534', marginBottom: '4px' }}>
                      {stats.entregados} pedido{stats.entregados !== 1 ? 's' : ''} entregado{stats.entregados !== 1 ? 's' : ''}
                    </div>
                    <div style={{ fontSize: '14px', color: '#14532d' }}>
                      ¡Excelente trabajo!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje si todo está al día */}
            {stats?.pendientes === 0 && stats?.procesando === 0 && (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#059669',
                background: '#d1fae5',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                <div style={{ fontWeight: '600', fontSize: '18px' }}>
                  ¡Todo al día!
                </div>
                <div style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9 }}>
                  No hay pedidos pendientes de atención
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resumen de Ingresos */}
      <div style={{
        marginTop: '32px',
        background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
        borderRadius: '12px',
        padding: '32px',
        color: 'white',
        boxShadow: '0 10px 15px -3px rgba(147, 51, 234, 0.3)'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '24px' }}>
          💰 Resumen Financiero
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          <div>
            <div style={{ opacity: 0.9, fontSize: '14px', marginBottom: '8px' }}>
              Ingresos Totales
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>
              S/ {(stats?.totalIngresos || 0).toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ opacity: 0.9, fontSize: '14px', marginBottom: '8px' }}>
              Ticket Promedio
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>
              S/ {stats?.totalPedidos > 0 ? ((stats?.totalIngresos || 0) / stats.totalPedidos).toFixed(2) : '0.00'}
            </div>
          </div>
          <div>
            <div style={{ opacity: 0.9, fontSize: '14px', marginBottom: '8px' }}>
              Pedidos Completados
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>
              {stats?.entregados || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
