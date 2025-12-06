export const formatPrice = (price) => {
  return `S/ ${parseFloat(price).toFixed(2)}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
