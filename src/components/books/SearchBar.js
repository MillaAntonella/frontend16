'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/libros?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      style={{ 
        width: '100%', 
        maxWidth: '700px', 
        margin: '0 auto' 
      }}
    >
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Buscar libros por título, autor o ISBN..."
          style={{
            width: '100%',
            padding: '16px 160px 16px 24px',
            fontSize: '1.1rem',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50px',
            outline: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: '#1f2937',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '3px solid white';
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '3px solid rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
        />
        <button
          type="submit"
          style={{
            position: 'absolute',
            right: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            color: '#1f2937',
            padding: '12px 28px',
            borderRadius: '50px',
            border: 'none',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(251, 191, 36, 0.4)';
          }}
        >
          🔎 Buscar
        </button>
      </div>
    </form>
  );
}
