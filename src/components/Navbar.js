'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Separate effect for mounting flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Separate effect for user data
  useEffect(() => {
    if (!isClient) return;

    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user');
        setUser(userData ? JSON.parse(userData) : null);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    };

    loadUser();

    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isClient]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const navLinkStyle = {
    color: '#374151',
    fontWeight: '500',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  };

  return (
    <nav style={{
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '2px solid #e5e7eb'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          <Link 
            href="/" 
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📚 Tienda de Libros
          </Link>

          <ul style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            <li>
              <Link 
                href="/" 
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3e8ff';
                  e.currentTarget.style.color = '#9333ea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#374151';
                }}
              >
                🏠 Inicio
              </Link>
            </li>
            <li>
              <Link 
                href="/libros" 
                style={navLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3e8ff';
                  e.currentTarget.style.color = '#9333ea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#374151';
                }}
              >
                📖 Libros
              </Link>
            </li>
            
            {isClient && (
              <>
                {user ? (
                  <>
                    <li>
                      <Link 
                        href="/carrito" 
                        style={navLinkStyle}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3e8ff';
                          e.currentTarget.style.color = '#9333ea';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        🛒 Carrito
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/pedidos" 
                        style={navLinkStyle}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3e8ff';
                          e.currentTarget.style.color = '#9333ea';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        📦 Mis Pedidos
                      </Link>
                    </li>
                    {user.rol === 'admin' && (
                      <li>
                        <Link 
                          href="/admin" 
                          style={{
                            ...navLinkStyle,
                            backgroundColor: '#dcfce7',
                            color: '#166534'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#bbf7d0';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#dcfce7';
                          }}
                        >
                          🛠️ Panel Admin
                        </Link>
                      </li>
                    )}
                    <li style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginLeft: '12px',
                      paddingLeft: '12px',
                      borderLeft: '2px solid #e5e7eb'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#f3f4f6',
                        padding: '8px 16px',
                        borderRadius: '8px'
                      }}>
                        <span style={{
                          fontSize: '1.2rem'
                        }}>
                          👤
                        </span>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}>
                          <span style={{
                            color: '#1f2937',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}>
                            {user.nombre}
                          </span>
                          {user.rol === 'admin' && (
                            <span style={{
                              backgroundColor: '#dcfce7',
                              color: '#166534',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              textAlign: 'center'
                            }}>
                              ADMINISTRADOR
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc2626';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ef4444';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.2)';
                        }}
                      >
                        🚪 Salir
                      </button>
                    </li>
                  </>
                ) : (
                  <li style={{ marginLeft: '12px' }}>
                    <Link
                      href="/login"
                      style={{
                        background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                        color: 'white',
                        padding: '10px 24px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(147, 51, 234, 0.3)',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(147, 51, 234, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(147, 51, 234, 0.3)';
                      }}
                    >
                      🔐 Iniciar Sesión
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
