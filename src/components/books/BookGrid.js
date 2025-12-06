'use client';
import BookCard from './BookCard';

export default function BookGrid({ books, loading, featured = false }) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '30px',
    width: '100%'
  };

  if (loading) {
    return (
      <div style={gridStyle}>
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            style={{
              backgroundColor: '#e5e7eb',
              height: '450px',
              borderRadius: '8px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />
        ))}
      </div>
    );
  }

  if (!books?.length) {
    return (
      <div style={{ 
        textAlign: 'center',
        padding: '60px 20px'
      }}>
        <p style={{ 
          color: '#6b7280',
          fontSize: '1.25rem'
        }}>
          No se encontraron libros
        </p>
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      {books.map((book) => (
        <BookCard key={book.id_libro} book={book} featured={featured} />
      ))}
    </div>
  );
}
