'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { booksAPI } from '@/lib/api/books';
import { authorsAPI } from '@/lib/api/authors';
import { editorialsAPI } from '@/lib/api/editorials';

export default function NuevoLibroPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [idAutor, setIdAutor] = useState('');
  const [idEditorial, setIdEditorial] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [isbn, setIsbn] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [autores, setAutores] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Estados para modales
  const [showAutorModal, setShowAutorModal] = useState(false);
  const [showEditorialModal, setShowEditorialModal] = useState(false);
  const [showDeleteAutorModal, setShowDeleteAutorModal] = useState(false);
  const [showDeleteEditorialModal, setShowDeleteEditorialModal] = useState(false);

  // Estados para nuevos autores/editoriales
  const [nuevoAutor, setNuevoAutor] = useState({ nombre: '', nacionalidad: '', biografia: '' });
  const [nuevaEditorial, setNuevaEditorial] = useState({ nombre: '', pais: '', sitio_web: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [autoresRes, editorialesRes] = await Promise.all([
        authorsAPI.getAll(),
        editorialsAPI.getAll()
      ]);

      if (autoresRes.success) setAutores(autoresRes.data);
      if (editorialesRes.success) setEditoriales(editorialesRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('❌ Error al cargar autores y editoriales');
    } finally {
      setLoadingData(false);
    }
  };

  const handleAgregarAutor = async () => {
    if (!nuevoAutor.nombre.trim()) {
      alert('❌ El nombre del autor es obligatorio');
      return;
    }

    try {
      const response = await authorsAPI.create({
        nombre: nuevoAutor.nombre,
        nacionalidad: nuevoAutor.nacionalidad || null,
        biografia: nuevoAutor.biografia || null
      });

      if (response.success) {
        alert('✅ Autor agregado exitosamente');
        setNuevoAutor({ nombre: '', nacionalidad: '', biografia: '' });
        setShowAutorModal(false);
        fetchInitialData(); // Recargar lista
      }
    } catch (error) {
      alert('❌ Error al agregar autor: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAgregarEditorial = async () => {
    if (!nuevaEditorial.nombre.trim()) {
      alert('❌ El nombre de la editorial es obligatorio');
      return;
    }

    try {
      const response = await editorialsAPI.create({
        nombre: nuevaEditorial.nombre,
        pais: nuevaEditorial.pais || null,
        sitio_web: nuevaEditorial.sitio_web || null
      });

      if (response.success) {
        alert('✅ Editorial agregada exitosamente');
        setNuevaEditorial({ nombre: '', pais: '', sitio_web: '' });
        setShowEditorialModal(false);
        fetchInitialData(); // Recargar lista
      }
    } catch (error) {
      alert('❌ Error al agregar editorial: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEliminarAutor = async () => {
    if (!idAutor) {
      alert('❌ Selecciona un autor para eliminar');
      return;
    }

    try {
      const response = await authorsAPI.delete(idAutor);
      if (response.success) {
        alert('✅ Autor eliminado exitosamente');
        setIdAutor('');
        setShowDeleteAutorModal(false);
        fetchInitialData();
      }
    } catch (error) {
      alert('❌ Error al eliminar autor: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEliminarEditorial = async () => {
    if (!idEditorial) {
      alert('❌ Selecciona una editorial para eliminar');
      return;
    }

    try {
      const response = await editorialsAPI.delete(idEditorial);
      if (response.success) {
        alert('✅ Editorial eliminada exitosamente');
        setIdEditorial('');
        setShowDeleteEditorialModal(false);
        fetchInitialData();
      }
    } catch (error) {
      alert('❌ Error al eliminar editorial: ' + (error.response?.data?.message || error.message));
    }
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = generateSlug(titulo);
      
      const bookData = {
        titulo,
        slug,
        id_autor: parseInt(idAutor),
        id_editorial: parseInt(idEditorial),
        precio: parseFloat(precio),
        stock: parseInt(stock),
        sinopsis: sinopsis || null,
        isbn: isbn || null,
        imagen_portada: 'https://via.placeholder.com/300x450/9333ea/ffffff?text=' + encodeURIComponent(titulo.substring(0, 20)),
        destacado: 0,
        activo: 1
      };

      const response = await booksAPI.create(bookData);

      if (response.success) {
        alert('✅ Libro agregado exitosamente');
        router.push('/admin/libros');
      } else {
        alert('❌ Error: ' + (response.message || 'No se pudo agregar el libro'));
      }
    } catch (error) {
      console.error('Error completo:', error);
      alert('❌ Error al agregar libro: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '48px 0',
        fontSize: '1.125rem',
        color: '#6b7280'
      }}>
        Cargando formulario...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '42rem',
      margin: '0 auto',
      marginTop: '40px'
    }}>
      <h1 style={{
        fontSize: '2.25rem',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        📚 Nuevo Libro
      </h1>

      <form 
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '32px',
          border: '2px solid #e5e7eb'
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#1f2937',
            fontSize: '0.875rem'
          }}>
            Título *
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={{
              width: '100%',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              outline: 'none'
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

        {/* Autor con botones para agregar/eliminar */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#1f2937',
            fontSize: '0.875rem'
          }}>
            Autor *
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={idAutor}
              onChange={(e) => setIdAutor(e.target.value)}
              required
              style={{
                flex: 1,
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                outline: 'none',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#9333ea';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">Selecciona un autor</option>
              {autores.map((autor) => (
                <option key={autor.id_autor} value={autor.id_autor}>
                  {autor.nombre}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAutorModal(true)}
              style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: '0.875rem'
              }}
            >
              + Agregar
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteAutorModal(true)}
              disabled={!idAutor}
              style={{
                padding: '12px 16px',
                background: idAutor ? '#ef4444' : '#cbd5e1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: idAutor ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap',
                fontSize: '1.25rem'
              }}
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Editorial con botones para agregar/eliminar */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#1f2937',
            fontSize: '0.875rem'
          }}>
            Editorial *
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={idEditorial}
              onChange={(e) => setIdEditorial(e.target.value)}
              required
              style={{
                flex: 1,
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                outline: 'none',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#9333ea';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">Selecciona una editorial</option>
              {editoriales.map((editorial) => (
                <option key={editorial.id_editorial} value={editorial.id_editorial}>
                  {editorial.nombre}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowEditorialModal(true)}
              style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: '0.875rem'
              }}
            >
              + Agregar
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteEditorialModal(true)}
              disabled={!idEditorial}
              style={{
                padding: '12px 16px',
                background: idEditorial ? '#ef4444' : '#cbd5e1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: idEditorial ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap',
                fontSize: '1.25rem'
              }}
            >
              🗑️
            </button>
          </div>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#1f2937',
              fontSize: '0.875rem'
            }}>
              Precio (S/) *
            </label>
            <input
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              style={{
                width: '100%',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                outline: 'none'
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

          <div>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#1f2937',
              fontSize: '0.875rem'
            }}>
              Stock *
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              style={{
                width: '100%',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                outline: 'none'
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
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#1f2937',
            fontSize: '0.875rem'
          }}>
            ISBN (opcional)
          </label>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="978-84-663-0000-0"
            style={{
              width: '100%',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              outline: 'none'
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

        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#1f2937',
            fontSize: '0.875rem'
          }}>
            Sinopsis (opcional)
          </label>
          <textarea
            value={sinopsis}
            onChange={(e) => setSinopsis(e.target.value)}
            rows={4}
            placeholder="Descripción del libro..."
            style={{
              width: '100%',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical'
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

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          paddingTop: '24px',
          borderTop: '2px solid #e5e7eb'
        }}>
          <button
            type="button"
            onClick={() => router.push('/admin/libros')}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#d1d5db' : 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 2px 4px rgba(147, 51, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(147, 51, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(147, 51, 234, 0.3)';
              }
            }}
          >
            {loading ? 'Guardando...' : '✅ Agregar Libro'}
          </button>
        </div>
      </form>

      {/* Modal Agregar Autor */}
      {showAutorModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }} onClick={() => setShowAutorModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ➕ Agregar Nuevo Autor
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                Nombre *
              </label>
              <input
                type="text"
                value={nuevoAutor.nombre}
                onChange={(e) => setNuevoAutor({...nuevoAutor, nombre: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="Gabriel García Márquez"
                onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                Nacionalidad
              </label>
              <input
                type="text"
                value={nuevoAutor.nacionalidad}
                onChange={(e) => setNuevoAutor({...nuevoAutor, nacionalidad: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="Colombiano"
                onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                Biografía
              </label>
              <textarea
                value={nuevoAutor.biografia}
                onChange={(e) => setNuevoAutor({...nuevoAutor, biografia: e.target.value})}
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                placeholder="Breve biografía del autor..."
                onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowAutorModal(false);
                  setNuevoAutor({ nombre: '', nacionalidad: '', biografia: '' });
                }}
                style={{
                  padding: '12px 24px',
                  background: '#e2e8f0',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAgregarAutor}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✅ Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar Editorial */}
      {showEditorialModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }} onClick={() => setShowEditorialModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ➕ Agregar Nueva Editorial
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                Nombre *
              </label>
              <input
                type="text"
                value={nuevaEditorial.nombre}
                onChange={(e) => setNuevaEditorial({...nuevaEditorial, nombre: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="Editorial Planeta"
                onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                País
              </label>
              <input
                type="text"
                value={nuevaEditorial.pais}
                onChange={(e) => setNuevaEditorial({...nuevaEditorial, pais: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="España"
                onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                Sitio Web
              </label>
              <input
                type="url"
                value={nuevaEditorial.sitio_web}
                onChange={(e) => setNuevaEditorial({...nuevaEditorial, sitio_web: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                placeholder="https://www.ejemplo.com"
                onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowEditorialModal(false);
                  setNuevaEditorial({ nombre: '', pais: '', sitio_web: '' });
                }}
                style={{
                  padding: '12px 24px',
                  background: '#e2e8f0',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAgregarEditorial}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✅ Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar Autor */}
      {showDeleteAutorModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }} onClick={() => setShowDeleteAutorModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
              ⚠️ Confirmar Eliminación
            </h2>
            <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: '1.6' }}>
              ¿Estás seguro de que deseas eliminar el autor <strong>{autores.find(a => a.id_autor === parseInt(idAutor))?.nombre}</strong>? Esta acción no se puede deshacer y afectará todos los libros asociados.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteAutorModal(false)}
                style={{
                  padding: '12px 24px',
                  background: '#e2e8f0',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarAutor}
                style={{
                  padding: '12px 24px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar Editorial */}
      {showDeleteEditorialModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }} onClick={() => setShowDeleteEditorialModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
              ⚠️ Confirmar Eliminación
            </h2>
            <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: '1.6' }}>
              ¿Estás seguro de que deseas eliminar la editorial <strong>{editoriales.find(e => e.id_editorial === parseInt(idEditorial))?.nombre}</strong>? Esta acción no se puede deshacer y afectará todos los libros asociados.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteEditorialModal(false)}
                style={{
                  padding: '12px 24px',
                  background: '#e2e8f0',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarEditorial}
                style={{
                  padding: '12px 24px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
