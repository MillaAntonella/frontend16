'use client';

import { useState, useEffect } from 'react';
import { ordersAPI } from '@/lib/api/orders';

export default function AdminEstadisticasPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pedidosPorMes, setPedidosPorMes] = useState([]);
  const [topLibros, setTopLibros] = useState([]);

  useEffect(() => {
    fetchEstadisticas();
  }, []);

  const fetchEstadisticas = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas generales
      const statsResponse = await ordersAPI.getStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Obtener todos los pedidos para análisis adicional
      const ordersResponse = await ordersAPI.getAll();
      if (ordersResponse.success) {
        const orders = ordersResponse.data || [];
        
        // Calcular pedidos por mes (últimos 6 meses)
        calcularPedidosPorMes(orders);
        
        // Calcular libros más vendidos
        calcularTopLibros(orders);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularPedidosPorMes = (orders) => {
    const meses = {};
    const hoy = new Date();
    
    // Inicializar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      meses[key] = {
        mes: fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
        cantidad: 0,
        ingresos: 0
      };
    }

    // Contar pedidos por mes
    orders.forEach(order => {
      const fecha = new Date(order.fecha_pedido);
      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      
      if (meses[key]) {
        meses[key].cantidad++;
        meses[key].ingresos += parseFloat(order.total || 0);
      }
    });

    setPedidosPorMes(Object.values(meses));
  };

  const calcularTopLibros = (orders) => {
    const librosVendidos = {};
    
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          const id = item.id_libro;
          if (!librosVendidos[id]) {
            librosVendidos[id] = {
              titulo: item.titulo_libro,
              cantidad: 0,
              ingresos: 0
            };
          }
          librosVendidos[id].cantidad += item.cantidad;
          librosVendidos[id].ingresos += parseFloat(item.subtotal || 0);
        });
      }
    });

    // Ordenar por cantidad vendida y tomar top 5
    const top = Object.values(librosVendidos)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
    
    setTopLibros(top);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8edf3 100%)'
      }}>
        <div style={{ fontSize: '24px', color: '#9333ea', fontWeight: '600' }}>Cargando estadísticas...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8edf3 100%)', 
      padding: '48px 24px' 
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '700', 
            background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={{ fontSize: '48px' }}>📈</span>
            Estadísticas y Reportes
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Análisis completo del rendimiento de tu tienda
          </p>
        </div>

        {/* Stats Principales */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px' 
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📚</div>
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {stats?.totalLibros || 0}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total de Libros</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {stats?.totalPedidos || 0}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Pedidos Totales</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {stats?.totalUsuarios || 0}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Usuarios Registrados</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              S/ {(stats?.totalIngresos || 0).toFixed(2)}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Ingresos Totales</div>
          </div>
        </div>

        {/* Estados de Pedidos */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            marginBottom: '24px',
            color: '#1e293b'
          }}>
            📊 Estado de Pedidos
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '16px' 
          }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fef3c7', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#92400e', marginBottom: '4px' }}>
                {stats?.pendientes || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#78350f' }}>⏳ Pendientes</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#dbeafe', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
                {stats?.procesando || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#1e3a8a' }}>⚙️ Procesando</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#d1fae5', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#065f46', marginBottom: '4px' }}>
                {stats?.enviados || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#064e3b' }}>🚚 Enviados</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#dcfce7', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
                {stats?.entregados || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#14532d' }}>✅ Entregados</div>
            </div>
          </div>
        </div>

        {/* Dos columnas: Pedidos por mes y Top libros */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {/* Pedidos por Mes */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              marginBottom: '24px',
              color: '#1e293b'
            }}>
              📅 Pedidos por Mes (Últimos 6 meses)
            </h2>
            {pedidosPorMes.map((mes, index) => {
              const maxCantidad = Math.max(...pedidosPorMes.map(m => m.cantidad));
              const porcentaje = maxCantidad > 0 ? (mes.cantidad / maxCantidad) * 100 : 0;
              
              return (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: '#475569'
                  }}>
                    <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{mes.mes}</span>
                    <span style={{ fontWeight: '700', color: '#1e293b' }}>
                      {mes.cantidad} pedidos - S/ {mes.ingresos.toFixed(2)}
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: '#e5e7eb',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${porcentaje}%`,
                      height: '100%',
                      background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top Libros Más Vendidos */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              marginBottom: '24px',
              color: '#1e293b'
            }}>
              🏆 Top 5 Libros Más Vendidos
            </h2>
            {topLibros.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                <p>No hay datos de ventas aún</p>
              </div>
            ) : (
              topLibros.map((libro, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    background: index % 2 === 0 ? '#f8fafc' : 'white',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    border: '2px solid #e5e7eb'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '18px',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                      {libro.titulo}
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      {libro.cantidad} unidades vendidas
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: '700', 
                    color: '#059669',
                    fontSize: '18px',
                    textAlign: 'right'
                  }}>
                    S/ {libro.ingresos.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Resumen Final */}
        <div style={{
          background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginTop: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
            💡 Resumen Ejecutivo
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', fontSize: '16px' }}>
            <div>
              <div style={{ opacity: 0.9, marginBottom: '4px' }}>Ticket Promedio:</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>
                S/ {stats?.totalPedidos > 0 ? ((stats?.totalIngresos || 0) / stats.totalPedidos).toFixed(2) : '0.00'}
              </div>
            </div>
            <div>
              <div style={{ opacity: 0.9, marginBottom: '4px' }}>Tasa de Entrega:</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>
                {stats?.totalPedidos > 0 
                  ? ((stats?.entregados || 0) / stats.totalPedidos * 100).toFixed(1) 
                  : '0'}%
              </div>
            </div>
            <div>
              <div style={{ opacity: 0.9, marginBottom: '4px' }}>Pedidos Activos:</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>
                {(stats?.pendientes || 0) + (stats?.procesando || 0) + (stats?.enviados || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
