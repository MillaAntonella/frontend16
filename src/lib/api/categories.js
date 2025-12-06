const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const categoriesAPI = {
  // Obtener todas las categorías
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/categorias`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, data: [] };
    }
  },

  // Obtener categoría por ID
  getById: async (id) => {
    const response = await apiClient.get(`/categorias/${id}`);
    return response.data;
  },

  // Obtener categoría por slug
  getBySlug: async (slug) => {
    try {
      const response = await fetch(`${API_URL}/categorias/${slug}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching category:', error);
      return { success: false, data: null };
    }
  },

  // Crear categoría (admin)
  create: async (data) => {
    const response = await apiClient.post('/categorias', data);
    return response.data;
  },
};
