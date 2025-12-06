'use client';
import Link from 'next/link';

export default function Footer() {
  const linkStyle = {
    color: '#9ca3af',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    display: 'block',
    padding: '4px 0'
  };

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      color: 'white',
      marginTop: 'auto',
      borderTop: '4px solid #9333ea'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '60px 20px 30px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              📚 Tienda de Libros
            </h3>
            <p style={{
              color: '#9ca3af',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              Tu librería online favorita. Descubre, lee y disfruta de los mejores libros.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '20px'
            }}>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#9333ea';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#374151';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                📘
              </a>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ec4899';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#374151';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                💬
              </a>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#374151';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                📧
              </a>
            </div>
          </div>
          
          <div>
            <h4 style={{
              fontWeight: '700',
              marginBottom: '20px',
              fontSize: '1.1rem',
              color: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🛍️ Comprar
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>
                <Link 
                  href="/libros" 
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  → Todos los Libros
                </Link>
              </li>
              <li>
                <Link 
                  href="/categorias" 
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  → Categorías
                </Link>
              </li>
              <li>
                <Link 
                  href="/libros?destacado=1" 
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  → Destacados
                </Link>
              </li>
              <li>
                <Link 
                  href="/ofertas" 
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  → Ofertas
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{
              fontWeight: '700',
              marginBottom: '20px',
              fontSize: '1.1rem',
              color: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              👤 Mi Cuenta
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>
                <Link 
                  href="/perfil" 
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  → Mi Perfil
                </Link>
              </li>
              <li>
                <Link 
                  href="/pedidos" 
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  → Mis Pedidos
                </Link>
              </li>
              <li>
                <Link 
                  href="/carrito" 
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  → Carrito
                </Link>
              </li>
              <li>
                <Link 
                  href="/favoritos" 
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  → Favoritos
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{
              fontWeight: '700',
              marginBottom: '20px',
              fontSize: '1.1rem',
              color: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ❓ Ayuda
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>
                <a 
                  href="#" 
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  → Contacto
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  → Envíos
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  → Devoluciones
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  → Términos y Condiciones
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{
          borderTop: '2px solid #374151',
          marginTop: '40px',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <p style={{
            color: '#9ca3af',
            margin: 0,
            fontSize: '0.95rem'
          }}>
            &copy; 2024 <strong style={{ color: '#f3f4f6' }}>Tienda de Libros</strong> - Semana 16. Todos los derechos reservados.
          </p>
          <p style={{
            color: '#9ca3af',
            margin: 0,
            fontSize: '0.9rem'
          }}>
            Hecho con 💜 por desarrolladores apasionados
          </p>
        </div>
      </div>
    </footer>
  );
}
