'use client';

export default function Card({ children, className = '', hover = false }) {
  return (
    <div className={`
      bg-white rounded-xl shadow-md overflow-hidden
      ${hover ? 'hover:shadow-xl hover:scale-105 transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}
