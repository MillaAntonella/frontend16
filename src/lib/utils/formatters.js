// Formatear precio
export const formatPrice = (price) => {
  return `S/ ${parseFloat(price).toFixed(2)}`;
};

// Formatear fecha
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Formatear fecha corta
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Formatear número con separador de miles
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Truncar texto
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Generar slug
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};
