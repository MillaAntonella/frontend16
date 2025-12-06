'use client';

import { useState, useEffect } from 'react';
import { ordersAPI } from '@/lib/api/orders';

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      if (response.success) {
        setPedidos(response.data || []);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      alert('❌ Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = async (pedidoId, nuevoEstado) => {
    try {
      const response = await ordersAPI.updateStatus(pedidoId, nuevoEstado);
      if (response.success) {
        alert('✅ Estado actualizado exitosamente');
        fetchPedidos();
      } else {
        alert('❌ Error al actualizar el estado');
      }
    } catch (error) {
      alert('❌ Error al actualizar el estado');
    }
  };

  const verDetalles = async (pedidoId) => {
    try {
      const response = await ordersAPI.getById(pedidoId);
      if (response.success) {
        setSelectedOrder(response.data);
        setShowModal(true);
      }
    } catch (error) {
      alert('❌ Error al cargar los detalles del pedido');
    }
  };

  const getEstadoBadgeStyle = (estado) => {
    const estilos = {
      pendiente: { background: '#fef3c7', color: '#92400e', border: '2px solid #fbbf24' },
      procesando: { background: '#dbeafe', color: '#1e40af', border: '2px solid #3b82f6' },
      enviado: { background: '#d1fae5', color: '#065f46', border: '2px solid #10b981' },
      entregado: { background: '#dcfce7', color: '#166534', border: '2px solid #22c55e' },
      cancelado: { background: '#fee2e2', color: '#991b1b', border: '2px solid #ef4444' }
    };
    return estilos[estado] || estilos.pendiente;
  };

  const pedidosFiltrados = filtroEstado === 'todos' 
    ? pedidos 
    : pedidos.filter(p => p.estado === filtroEstado);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8edf3 100%)'
      }}>
        <div style={{ fontSize: '24px', color: '#9333ea', fontWeight: '600' }}>Cargando pedidos...</div>
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
            <span style={{ fontSize: '48px' }}>📦</span>
            Gestión de Pedidos
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Administra y actualiza el estado de todos los pedidos del sistema
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px' 
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #fbbf24'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
              {pedidos.filter(p => p.estado === 'pendiente').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Pendientes</div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #3b82f6'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚙️</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
              {pedidos.filter(p => p.estado === 'procesando').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Procesando</div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #10b981'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚚</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
              {pedidos.filter(p => p.estado === 'enviado').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Enviados</div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #22c55e'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
              {pedidos.filter(p => p.estado === 'entregado').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Entregados</div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #ef4444'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>❌</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
              {pedidos.filter(p => p.estado === 'cancelado').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Cancelados</div>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '20px', 
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', color: '#1e293b' }}>Filtrar por estado:</span>
            {['todos', 'pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'].map(estado => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filtroEstado === estado 
                    ? 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)' 
                    : '#e2e8f0',
                  color: filtroEstado === estado ? 'white' : '#475569',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {estado}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de Pedidos */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>N° Pedido</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Cliente</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Fecha</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Total</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Items</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Estado</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                      <div style={{ fontSize: '18px', fontWeight: '600' }}>No hay pedidos {filtroEstado !== 'todos' ? `en estado "${filtroEstado}"` : ''}</div>
                    </td>
                  </tr>
                ) : (
                  pedidosFiltrados.map((pedido, index) => (
                    <tr 
                      key={pedido.id_pedido}
                      style={{ 
                        borderBottom: '1px solid #e5e7eb',
                        background: index % 2 === 0 ? 'white' : '#f9fafb'
                      }}
                    >
                      <td style={{ padding: '16px', fontWeight: '600', color: '#1e293b' }}>
                        {pedido.numero_pedido}
                      </td>
                      <td style={{ padding: '16px', color: '#475569' }}>
                        {pedido.usuario_nombre}
                      </td>
                      <td style={{ padding: '16px', color: '#475569', fontSize: '14px' }}>
                        {pedido.usuario_email}
                      </td>
                      <td style={{ padding: '16px', color: '#475569' }}>
                        {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES')}
                      </td>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#059669' }}>
                        S/ {parseFloat(pedido.total).toFixed(2)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center', color: '#475569' }}>
                        {pedido.total_items || 0}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <select
                          value={pedido.estado}
                          onChange={(e) => handleEstadoChange(pedido.id_pedido, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '2px solid #e2e8f0',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            ...getEstadoBadgeStyle(pedido.estado)
                          }}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="procesando">Procesando</option>
                          <option value="enviado">Enviado</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <button
                          onClick={() => verDetalles(pedido.id_pedido)}
                          style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          👁️ Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Detalles */}
        {showModal && selectedOrder && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
            onClick={() => setShowModal(false)}
          >
            <div 
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '800px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ 
                    fontSize: '28px', 
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px'
                  }}>
                    Detalles del Pedido
                  </h2>
                  <p style={{ color: '#64748b' }}>#{selectedOrder.numero_pedido}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  ✕ Cerrar
                </button>
              </div>

              {/* Información del Cliente */}
              <div style={{ 
                background: '#f8fafc', 
                borderRadius: '12px', 
                padding: '20px', 
                marginBottom: '24px',
                border: '2px solid #e2e8f0'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
                  👤 Información del Cliente
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <strong style={{ color: '#64748b' }}>Nombre:</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#1e293b' }}>{selectedOrder.usuario_nombre}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#64748b' }}>Email:</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#1e293b' }}>{selectedOrder.usuario_email}</p>
                  </div>
                </div>
              </div>

              {/* Información de Envío */}
              <div style={{ 
                background: '#f8fafc', 
                borderRadius: '12px', 
                padding: '20px', 
                marginBottom: '24px',
                border: '2px solid #e2e8f0'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
                  📍 Dirección de Envío
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>
                  {selectedOrder.direccion_envio}<br />
                  {selectedOrder.ciudad_envio} - CP: {selectedOrder.codigo_postal_envio}<br />
                  📞 Teléfono: {selectedOrder.telefono_contacto}
                </p>
              </div>

              {/* Items del Pedido */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
                  📚 Productos
                </h3>
                {selectedOrder.items && selectedOrder.items.map((item) => (
                  <div 
                    key={item.id_item}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      background: 'white',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      border: '2px solid #e2e8f0'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                        {item.titulo_libro}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '14px' }}>
                        Cantidad: {item.cantidad} × S/ {parseFloat(item.precio_unitario).toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontWeight: '700', color: '#059669', fontSize: '18px' }}>
                      S/ {parseFloat(item.subtotal).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{
                background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                color: 'white',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '20px', fontWeight: '700' }}>TOTAL</span>
                <span style={{ fontSize: '28px', fontWeight: '700' }}>
                  S/ {parseFloat(selectedOrder.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
