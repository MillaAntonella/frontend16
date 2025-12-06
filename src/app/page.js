'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import BookGrid from '@/components/books/BookGrid';
import SearchBar from '@/components/books/SearchBar';
import { booksAPI } from '@/lib/api/books';
import { categoriesAPI } from '@/lib/api/categories';
import Link from 'next/link';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        booksAPI.getFeatured(8),
        categoriesAPI.getAll()
      ]);

      if (booksRes.success) setFeaturedBooks(booksRes.data);
      if (categoriesRes.success) setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(to right, #9333ea, #ec4899)',
        color: 'white',
        padding: '80px 0'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{ 
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h1 style={{ 
              fontSize: '3.5rem',
              fontWeight: 'bold',
              marginBottom: '20px',
              lineHeight: '1.2'
            }}>
              📚 Tienda de Libros
            </h1>
            <p style={{ 
              fontSize: '1.5rem',
              marginBottom: '30px',
              opacity: '0.95'
            }}>
              Descubre tu próxima gran lectura
            </p>
          </div>
          
          <SearchBar />
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ 
        padding: '80px 0',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h2 style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '60px',
            color: '#1f2937'
          }}>
            📖 Explora por Categorías
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {categories.slice(0, 3).map((category) => (
              <Link 
                key={category.id_categoria} 
                href={`/categorias/${category.slug}`}
                style={{
                  backgroundColor: 'white',
                  padding: '40px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  display: 'block'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{ 
                  fontSize: '3.5rem',
                  marginBottom: '20px'
                }}>
                  {category.nombre.toLowerCase().includes('ficción') ? '🚀' : 
                   category.nombre.toLowerCase().includes('no ficción') ? '📚' : '🔍'}
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '10px'
                }}>
                  {category.nombre}
                </h3>
                <p style={{ 
                  color: '#6b7280',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}>
                  {category.descripcion}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section style={{ 
        padding: '80px 0',
        backgroundColor: 'white'
      }}>
        <div style={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '50px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <h2 style={{ 
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0
            }}>
              ✨ Libros Destacados
            </h2>
            <Link 
              href="/libros"
              style={{
                color: '#9333ea',
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '1.1rem',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#7c3aed'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9333ea'}
            >
              Ver todos →
            </Link>
          </div>
          
          <BookGrid books={featuredBooks} loading={loading} featured={true} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
