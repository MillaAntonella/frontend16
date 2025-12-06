'use client';
import Link from 'next/link';

export default function BookCard({ book, featured = false }) {
  const formatPrice = (price) => `S/ ${parseFloat(price).toFixed(2)}`;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      position: 'relative',
      transition: 'box-shadow 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)'} 
    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}
    >
      {featured && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 10
        }}>
          <span style={{
            backgroundColor: '#fbbf24',
            color: '#1f2937',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            padding: '6px 12px',
            borderRadius: '20px',
            display: 'inline-block'
          }}>
            ⭐ Destacado
          </span>
        </div>
      )}
      
      <Link href={`/libros/${book.slug}`} style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          position: 'relative',
          height: '250px',
          background: 'linear-gradient(135deg, #e9d5ff 0%, #fbcfe8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '4rem' }}>📚</div>
        </div>
        
        <div style={{
          padding: '20px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '10px',
            fontSize: '1.1rem',
            lineHeight: '1.4',
            minHeight: '3rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {book.titulo}
          </h3>
          
          <p style={{
            fontSize: '0.9rem',
            color: '#6b7280',
            marginBottom: '15px'
          }}>
            Por {book.autor}
          </p>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '15px',
            marginTop: 'auto'
          }}>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              {formatPrice(book.precio)}
            </span>
            <span style={{
              fontSize: '0.85rem',
              color: '#6b7280'
            }}>
              Stock: {book.stock}
            </span>
          </div>
          
          <button style={{
            width: '100%',
            backgroundColor: '#9333ea',
            color: 'white',
            fontWeight: '600',
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '1rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9333ea'}
          >
            🛒 Agregar
          </button>
        </div>
      </Link>
    </div>
  );
}
