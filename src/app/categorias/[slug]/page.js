'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import BookGrid from '@/components/books/BookGrid';
import SearchBar from '@/components/books/SearchBar';
import { booksAPI } from '@/lib/api/books';
import { categoriesAPI } from '@/lib/api/categories';

export default function CategoriaPage() {
  const params = useParams();
  const slug = params.slug;
  
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
  }, [slug]);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      // Obtener información de la categoría
      const categoryRes = await categoriesAPI.getBySlug(slug);
      
      if (categoryRes.success) {
        setCategory(categoryRes.data);
        
        // Obtener libros de la categoría
        const booksRes = await booksAPI.getByCategorySlug(slug);
        
        if (booksRes.success) {
          setBooks(booksRes.data);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('ficción') || name.includes('ciencia')) return '🚀';
    if (name.includes('no ficción') || name.includes('historia')) return '📚';
    if (name.includes('misterio') || name.includes('thriller')) return '🔍';
    if (name.includes('romance')) return '💕';
    if (name.includes('infantil') || name.includes('juvenil')) return '🎨';
    if (name.includes('biografía')) return '👤';
    if (name.includes('autoayuda')) return '✨';
    return '📖';
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#f9fafb' 
      }}>
        <Navbar />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          fontSize: '1.125rem',
          color: '#6b7280'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <div>Cargando libros...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#f9fafb' 
      }}>
        <Navbar />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          fontSize: '1.125rem',
          color: '#6b7280'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
            <div>Categoría no encontrada</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '3rem' }}>
              {getCategoryIcon(category.nombre)}
            </span>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: 'bold',
              lineHeight: '1.2',
              margin: 0
            }}>
              {category.nombre}
            </h1>
          </div>
          
          {category.descripcion && (
            <p style={{
              fontSize: '1.2rem',
              textAlign: 'center',
              marginBottom: '30px',
              opacity: 0.95,
              maxWidth: '800px',
              margin: '0 auto 30px'
            }}>
              {category.descripcion}
            </p>
          )}
          
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
        {books.length > 0 && (
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
            <span style={{ fontSize: '1.5rem' }}>📚</span>
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
              }}>{books.length}</span> {books.length === 1 ? 'libro' : 'libros'}
            </p>
          </div>
        )}

        {books.length === 0 && !loading && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📚</div>
            <p style={{ 
              color: '#92400e',
              fontSize: '1.3rem',
              fontWeight: '600',
              marginBottom: '10px'
            }}>
              No hay libros disponibles en esta categoría
            </p>
            <p style={{ 
              color: '#78350f',
              fontSize: '1rem'
            }}>
              Pronto agregaremos más títulos
            </p>
          </div>
        )}
        
        <BookGrid books={books} loading={loading} />
      </main>

      <Footer />
    </div>
  );
}
