'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import { booksAPI } from '@/lib/api/books';
import { useCart } from '@/hooks/useCart';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [params.slug]);

  const fetchBook = async () => {
    try {
      const response = await booksAPI.getBySlug(params.slug);
      if (response.success) {
        setBook(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setAdding(true);
    try {
      const result = await addItem(book.id_libro, quantity);
      if (result.success) {
        alert('✅ Libro agregado al carrito');
      } else {
        alert('❌ ' + (result.message || 'Error al agregar al carrito'));
      }
    } catch (error) {
      alert('❌ Error al agregar al carrito');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '1.5rem', color: '#6b7280' }}>⏳ Cargando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '1.5rem', color: '#6b7280' }}>Libro no encontrado</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      <Navbar />
      
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
          {/* Image */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: '400px',
              height: '550px',
              background: 'linear-gradient(135deg, #e9d5ff 0%, #fbcfe8 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
            }}>
              📚
            </div>
          </div>

          {/* Info */}
          <div>
            {book.destacado && (
              <span style={{
                backgroundColor: '#fbbf24',
                color: '#1f2937',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                display: 'inline-block',
                marginBottom: '20px'
              }}>
                ⭐ Destacado
              </span>
            )}

            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '15px',
              lineHeight: '1.2'
            }}>
              {book.titulo}
            </h1>

            <p style={{
              fontSize: '1.3rem',
              color: '#6b7280',
              marginBottom: '30px'
            }}>
              Por <strong>{book.autor}</strong>
            </p>

            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              marginBottom: '30px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <p style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#9333ea',
                marginBottom: '10px'
              }}>
                S/ {parseFloat(book.precio).toFixed(2)}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                📦 Stock disponible: <strong>{book.stock}</strong> unidades
              </p>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '10px',
                color: '#374151'
              }}>
                Cantidad:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  −
                </button>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                  disabled={quantity >= book.stock}
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: quantity >= book.stock ? '#f3f4f6' : 'white',
                    fontSize: '1.5rem',
                    cursor: quantity >= book.stock ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (quantity < book.stock) e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    if (quantity < book.stock) e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding || book.stock === 0}
              style={{
                width: '100%',
                padding: '18px',
                background: adding || book.stock === 0 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: adding || book.stock === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)',
                marginBottom: '30px'
              }}
              onMouseEnter={(e) => {
                if (!adding && book.stock > 0) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(147, 51, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(147, 51, 234, 0.3)';
              }}
            >
              {adding ? '⏳ Agregando...' : book.stock === 0 ? '❌ Sin Stock' : '🛒 Agregar al Carrito'}
            </button>

            {/* Description */}
            {book.sinopsis && (
              <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  color: '#1f2937'
                }}>
                  📖 Sinopsis
                </h2>
                <p style={{
                  color: '#4b5563',
                  lineHeight: '1.8',
                  fontSize: '1rem'
                }}>
                  {book.sinopsis}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
