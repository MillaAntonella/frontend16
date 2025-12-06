'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import { booksAPI } from '@/lib/api/books';
import { formatPrice } from '@/lib/utils/formatters';

export default function AdminLibrosPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await booksAPI.getAll({ limit: 100 });
      if (response.success) {
        setBooks(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este libro?')) return;

    try {
      const response = await booksAPI.delete(id);
      if (response.success) {
        alert('✅ Libro eliminado');
        fetchBooks();
      }
    } catch (error) {
      alert('❌ Error al eliminar');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '48px 0',
        fontSize: '1.125rem',
        color: '#6b7280'
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          📚 Gestión de Libros
        </h1>
        <button
          onClick={() => router.push('/admin/libros/nuevo')}
          style={{
            background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(147, 51, 234, 0.3)'
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
          + Nuevo Libro
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        border: '2px solid #e5e7eb'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead style={{
            backgroundColor: '#f9fafb',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <tr>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>ID</th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Título</th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Autor</th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Precio</th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Stock</th>
              <th style={{
                padding: '16px 24px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr 
                key={book.id_libro}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: hoveredRow === book.id_libro ? '#f9fafb' : 'white',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={() => setHoveredRow(book.id_libro)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={{
                  padding: '16px 24px',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>{book.id_libro}</td>
                <td style={{
                  padding: '16px 24px',
                  fontWeight: '500',
                  color: '#1f2937',
                  fontSize: '0.875rem'
                }}>{book.titulo}</td>
                <td style={{
                  padding: '16px 24px',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>{book.autor_nombre}</td>
                <td style={{
                  padding: '16px 24px',
                  color: '#1f2937',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>{formatPrice(book.precio)}</td>
                <td style={{
                  padding: '16px 24px',
                  fontSize: '0.875rem'
                }}>
                  <span style={{
                    backgroundColor: book.stock > 0 ? '#dcfce7' : '#fee2e2',
                    color: book.stock > 0 ? '#166534' : '#991b1b',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {book.stock}
                  </span>
                </td>
                <td style={{
                  padding: '16px 24px'
                }}>
                  <button
                    onClick={() => handleDelete(book.id_libro)}
                    style={{
                      color: '#dc2626',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                      e.currentTarget.style.color = '#991b1b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#dc2626';
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
