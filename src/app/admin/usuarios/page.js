'use client';

import { useState, useEffect } from 'react';

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroRol, setFiltroRol] = useState('todos');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsuarios(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('❌ Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleRolChange = async (userId, nuevoRol) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rol: nuevoRol })
      });

      if (response.ok) {
        alert('✅ Rol actualizado exitosamente');
        fetchUsuarios();
      } else {
        alert('❌ Error al actualizar el rol');
      }
    } catch (error) {
      alert('❌ Error al actualizar el rol');
    }
  };

  const verDetalles = (usuario) => {
    setSelectedUser(usuario);
    setShowModal(true);
  };

  const getRolBadgeStyle = (rol) => {
    if (rol === 'admin') {
      return { background: '#fee2e2', color: '#991b1b', border: '2px solid #ef4444' };
    }
    return { background: '#dbeafe', color: '#1e40af', border: '2px solid #3b82f6' };
  };

  const usuariosFiltrados = filtroRol === 'todos' 
    ? usuarios 
    : usuarios.filter(u => u.rol === filtroRol);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8edf3 100%)'
      }}>
        <div style={{ fontSize: '24px', color: '#9333ea', fontWeight: '600' }}>Cargando usuarios...</div>
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
            <span style={{ fontSize: '48px' }}>👥</span>
            Gestión de Usuarios
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Administra los usuarios registrados y sus roles en el sistema
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
            borderLeft: '4px solid #3b82f6'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👤</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
              {usuarios.length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Total Usuarios</div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #ef4444'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👑</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
              {usuarios.filter(u => u.rol === 'admin').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Administradores</div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #10b981'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👨‍💼</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
              {usuarios.filter(u => u.rol === 'cliente').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Clientes</div>
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
            <span style={{ fontWeight: '600', color: '#1e293b' }}>Filtrar por rol:</span>
            {['todos', 'admin', 'cliente'].map(rol => (
              <button
                key={rol}
                onClick={() => setFiltroRol(rol)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filtroRol === rol 
                    ? 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)' 
                    : '#e2e8f0',
                  color: filtroRol === rol ? 'white' : '#475569',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {rol === 'todos' ? 'Todos' : rol === 'admin' ? 'Administradores' : 'Clientes'}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de Usuarios */}
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
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Nombre</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Teléfono</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Fecha Registro</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Rol</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                      <div style={{ fontSize: '18px', fontWeight: '600' }}>No hay usuarios {filtroRol !== 'todos' ? `con rol "${filtroRol}"` : ''}</div>
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((usuario, index) => (
                    <tr 
                      key={usuario.id_usuario}
                      style={{ 
                        borderBottom: '1px solid #e5e7eb',
                        background: index % 2 === 0 ? 'white' : '#f9fafb'
                      }}
                    >
                      <td style={{ padding: '16px', fontWeight: '600', color: '#1e293b' }}>
                        #{usuario.id_usuario}
                      </td>
                      <td style={{ padding: '16px', color: '#475569', fontWeight: '500' }}>
                        {usuario.nombre}
                      </td>
                      <td style={{ padding: '16px', color: '#475569', fontSize: '14px' }}>
                        {usuario.email}
                      </td>
                      <td style={{ padding: '16px', color: '#475569' }}>
                        {usuario.telefono || 'No registrado'}
                      </td>
                      <td style={{ padding: '16px', color: '#475569' }}>
                        {new Date(usuario.fecha_registro).toLocaleDateString('es-ES')}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <select
                          value={usuario.rol}
                          onChange={(e) => handleRolChange(usuario.id_usuario, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '2px solid #e2e8f0',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            ...getRolBadgeStyle(usuario.rol)
                          }}
                        >
                          <option value="cliente">Cliente</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <button
                          onClick={() => verDetalles(usuario)}
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
        {showModal && selectedUser && (
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
                maxWidth: '600px',
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
                    Detalles del Usuario
                  </h2>
                  <p style={{ color: '#64748b' }}>ID: #{selectedUser.id_usuario}</p>
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

              {/* Información Personal */}
              <div style={{ 
                background: '#f8fafc', 
                borderRadius: '12px', 
                padding: '20px', 
                marginBottom: '16px',
                border: '2px solid #e2e8f0'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
                  👤 Información Personal
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <strong style={{ color: '#64748b', fontSize: '14px' }}>Nombre completo:</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#1e293b', fontSize: '16px' }}>{selectedUser.nombre}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#64748b', fontSize: '14px' }}>Email:</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#1e293b', fontSize: '16px' }}>{selectedUser.email}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#64748b', fontSize: '14px' }}>Teléfono:</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#1e293b', fontSize: '16px' }}>{selectedUser.telefono || 'No registrado'}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#64748b', fontSize: '14px' }}>Rol:</strong>
                    <p style={{ 
                      margin: '4px 0 0 0', 
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      ...getRolBadgeStyle(selectedUser.rol)
                    }}>
                      {selectedUser.rol}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dirección */}
              {selectedUser.direccion && (
                <div style={{ 
                  background: '#f8fafc', 
                  borderRadius: '12px', 
                  padding: '20px', 
                  marginBottom: '16px',
                  border: '2px solid #e2e8f0'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
                    📍 Dirección
                  </h3>
                  <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>
                    {selectedUser.direccion}<br />
                    {selectedUser.ciudad && `${selectedUser.ciudad} - `}
                    {selectedUser.codigo_postal && `CP: ${selectedUser.codigo_postal}`}
                  </p>
                </div>
              )}

              {/* Fecha de Registro */}
              <div style={{ 
                background: '#f8fafc', 
                borderRadius: '12px', 
                padding: '20px',
                border: '2px solid #e2e8f0'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>
                  📅 Información de Registro
                </h3>
                <div>
                  <strong style={{ color: '#64748b', fontSize: '14px' }}>Fecha de registro:</strong>
                  <p style={{ margin: '4px 0 0 0', color: '#1e293b', fontSize: '16px' }}>
                    {new Date(selectedUser.fecha_registro).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
