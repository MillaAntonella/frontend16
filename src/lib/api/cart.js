const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No token found in localStorage for cart');
    return {
      'Content-Type': 'application/json'
    };
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const cartAPI = {
  get: async () => {
    try {
      const response = await fetch(`${API_URL}/carrito`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        return { success: false, data: { items: [] } };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return { success: false, data: { items: [] } };
    }
  },

  addItem: async (bookId, quantity = 1) => {
    try {
      const response = await fetch(`${API_URL}/carrito/items`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id_libro: bookId, cantidad: quantity })
      });
      
      if (!response.ok) {
        return { success: false, message: 'Error al agregar al carrito' };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding item:', error);
      return { success: false, message: 'Error al agregar al carrito' };
    }
  },

  updateItem: async (itemId, quantity) => {
    try {
      const response = await fetch(`${API_URL}/carrito/items/${itemId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ cantidad: quantity })
      });
      
      if (!response.ok) {
        return { success: false, message: 'Error al actualizar cantidad' };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating item:', error);
      return { success: false, message: 'Error al actualizar cantidad' };
    }
  },

  removeItem: async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/carrito/items/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        return { success: false, message: 'Error al eliminar item' };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing item:', error);
      return { success: false, message: 'Error al eliminar item' };
    }
  },

  clear: async () => {
    try {
      const response = await fetch(`${API_URL}/carrito/clear`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        return { success: false, message: 'Error al vaciar carrito' };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: 'Error al vaciar carrito' };
    }
  }
};
