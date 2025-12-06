'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import { authAPI } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(formData);

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        window.dispatchEvent(new Event('storage'));
        
        if (data.data.user.rol === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f9fafb'
    }}>
      <Navbar />
      
      <main style={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '450px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            padding: '40px',
            border: '2px solid #e5e7eb'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🔐</div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                Iniciar Sesión
              </h1>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Ingresa a tu cuenta para continuar
              </p>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '2px solid #ef4444',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <p style={{
                  color: '#991b1b',
                  fontSize: '0.9rem',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#374151',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '0.95rem'
                }}>
                  📧 Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="tu@email.com"
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

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: '#374151',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '0.95rem'
                }}>
                  🔒 Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
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

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)'
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
                {loading ? '⏳ Iniciando sesión...' : '✨ Iniciar Sesión'}
              </button>
            </form>

            <div style={{
              marginTop: '25px',
              textAlign: 'center',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '10px' }}>
                ¿No tienes una cuenta?
              </p>
              <Link
                href="/registro"
                style={{
                  color: '#9333ea',
                  fontWeight: '600',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#7c3aed'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9333ea'}
              >
                📝 Crear cuenta nueva
              </Link>
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            backgroundColor: '#fef3c7',
            padding: '15px',
            borderRadius: '8px',
            border: '2px solid #fbbf24'
          }}>
            <p style={{
              color: '#92400e',
              fontSize: '0.85rem',
              margin: 0,
              fontWeight: '500'
            }}>
              💡 <strong>Usuario de prueba:</strong><br />
              Email: juan@test.com | Password: password123
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
