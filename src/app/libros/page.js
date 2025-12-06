'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import BookGrid from '@/components/books/BookGrid';
import SearchBar from '@/components/books/SearchBar';
import { booksAPI } from '@/lib/api/books';

export default function LibrosPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (query) {
        response = await booksAPI.search(query);
      } else {
        response = await booksAPI.getAll({ limit: 50 });
      }

      if (response.success) {
        setBooks(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#f9fafb' 
    }}>
      <Navbar />
      
      <div style={{ 
        background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
        color: 'white',
        padding: '60px 0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '30px',
            lineHeight: '1.2'
          }}>
            {query ? (
              <>
                🔍 Resultados para: <span style={{ 
                  color: '#fbbf24',
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(251, 191, 36, 0.5)'
                }}>&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              '📚 Catálogo Completo de Libros'
            )}
          </h1>
          <SearchBar />
        </div>
      </div>

      <main style={{ 
        flex: 1,
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '60px 20px'
      }}>
        {query && books.length > 0 && (
          <div style={{
            backgroundColor: '#dbeafe',
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            padding: '16px 24px',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
            <p style={{ 
              color: '#1e40af',
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: 0
            }}>
              Se encontraron <span style={{ 
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontWeight: 'bold'
              }}>{books.length}</span> resultados
            </p>
          </div>
        )}

        {query && books.length === 0 && !loading && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😕</div>
            <p style={{ 
              color: '#92400e',
              fontSize: '1.3rem',
              fontWeight: '600',
              marginBottom: '10px'
            }}>
              No se encontraron resultados para &ldquo;{query}&rdquo;
            </p>
            <p style={{ 
              color: '#78350f',
              fontSize: '1rem'
            }}>
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}
        
        <BookGrid books={books} loading={loading} />
      </main>

      <Footer />
    </div>
  );
}