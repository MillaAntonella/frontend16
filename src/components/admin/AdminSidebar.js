'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredLogout, setHoveredLogout] = useState(false);

  const menuItems = [
    { icon: '📊', label: 'Dashboard', href: '/admin' },
    { icon: '📚', label: 'Libros', href: '/admin/libros' },
    { icon: '📦', label: 'Pedidos', href: '/admin/pedidos' },
    { icon: '👥', label: 'Usuarios', href: '/admin/usuarios' },
    { icon: '📈', label: 'Estadísticas', href: '/admin/estadisticas' },
  ];

  const handleLogout = () => {
    // Eliminar token y datos de usuario del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirigir al login
    router.push('/login');
  };

  const getItemStyle = (href) => {
    const isActive = pathname === href;
    const isHovered = hoveredItem === href;

    if (isActive) {
      return {
        background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
        color: 'white',
        boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)',
        transform: 'translateX(4px)',
      };
    }

    if (isHovered) {
      return {
        backgroundColor: '#f3e8ff',
        color: '#9333ea',
      };
    }

    return {
      backgroundColor: 'transparent',
      color: '#374151',
    };
  };

  return (
    <aside style={{
      width: '16rem',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      height: '100vh',
      position: 'sticky',
      top: 0,
      borderRight: '2px solid #e5e7eb'
    }}>
      <div style={{
        padding: '24px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          Panel Admin
        </h2>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          Gestión del sistema
        </p>
      </div>

      <nav style={{
        padding: '16px'
      }}>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '8px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              fontWeight: '500',
              ...getItemStyle(item.href)
            }}
            onMouseEnter={() => setHoveredItem(item.href)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span style={{
              fontSize: '1.5rem'
            }}>
              {item.icon}
            </span>
            <span>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Botón de Cerrar Sesión */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '16px',
        right: '16px'
      }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '2px solid #e5e7eb',
            background: hoveredLogout ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'white',
            color: hoveredLogout ? 'white' : '#ef4444',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: hoveredLogout ? '0 4px 6px rgba(239, 68, 68, 0.3)' : 'none'
          }}
          onMouseEnter={() => setHoveredLogout(true)}
          onMouseLeave={() => setHoveredLogout(false)}
        >
          <span style={{ fontSize: '1.5rem' }}>🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
