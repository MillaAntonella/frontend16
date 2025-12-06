'use client';
import { useState } from 'react';

export default function AdminStats({ stats }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const cards = [
    { 
      icon: '📚', 
      label: 'Total Libros', 
      value: stats?.totalLibros || 0,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
    },
    { 
      icon: '📦', 
      label: 'Pedidos Totales', 
      value: stats?.totalPedidos || 0,
      gradient: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)'
    },
    { 
      icon: '👥', 
      label: 'Usuarios', 
      value: stats?.totalUsuarios || 0,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    { 
      icon: '💰', 
      label: 'Ingresos', 
      value: `S/ ${(stats?.ingresosTotales || 0).toFixed(2)}`,
      gradient: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)'
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px'
    }}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            background: card.gradient,
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '24px',
            transform: hoveredIndex === index ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '4px'
              }}>
                {card.label}
              </p>
              <p style={{
                fontSize: '1.875rem',
                fontWeight: 'bold'
              }}>
                {card.value}
              </p>
            </div>
            <div style={{
              fontSize: '3rem',
              opacity: '0.8'
            }}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
