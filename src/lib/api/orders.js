const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No token found in localStorage');
    return {
      'Content-Type': 'application/json'
    };
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const ordersAPI = {
  getMyOrders: async () => {
    try {
      const headers = getAuthHeaders();
      const token = localStorage.getItem('token');
      
      console.log('=== DEBUG ORDERS ===');
      console.log('Token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'NO TOKEN');
      console.log('Headers:', headers);
      console.log('==================');
      
      // Cambiado a /mis-pedidos
      const response = await fetch(`${API_URL}/pedidos/mis-pedidos`, {
        method: 'GET',
        headers
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('Orders fetch failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return { success: false, data: [], message: 'No se pudieron cargar los pedidos' };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  // Admin: Obtener todos los pedidos
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        console.error('Failed to fetch all orders:', response.status);
        return { success: false, data: [], message: 'No se pudieron cargar los pedidos' };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return { success: false, data: [], message: error.message };
    }
  },

  // Admin: Obtener estadísticas (puede ser implementado en el backend o calculado en frontend)
  getStats: async () => {
    try {
      // Obtener pedidos
      const ordersResponse = await fetch(`${API_URL}/pedidos`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      // Obtener libros
      const booksResponse = await fetch(`${API_URL}/libros`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      // Obtener usuarios
      const usersResponse = await fetch(`${API_URL}/usuarios`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      let orders = [];
      let books = [];
      let users = [];
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        orders = ordersData.data || [];
      }
      
      if (booksResponse.ok) {
        const booksData = await booksResponse.json();
        books = booksData.data || booksData.libros || [];
      }
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        users = usersData.data || [];
      }
      
      // Calcular estadísticas
      const stats = {
        totalPedidos: orders.length,
        pendientes: orders.filter(o => o.estado === 'pendiente').length,
        procesando: orders.filter(o => o.estado === 'procesando').length,
        enviados: orders.filter(o => o.estado === 'enviado').length,
        entregados: orders.filter(o => o.estado === 'entregado').length,
        totalIngresos: orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0),
        totalLibros: books.length,
        totalUsuarios: users.length,
        ingresosTotales: orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0)
      };
      
      return { success: true, data: stats };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { success: false, data: null };
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        return { success: false, data: null };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      return { success: false, data: null };
    }
  },

  create: async (orderData) => {
    try {
      console.log('Creating order with data:', orderData);
      
      const headers = getAuthHeaders();
      console.log('Request headers present:', {
        hasContentType: !!headers['Content-Type'],
        hasAuth: !!headers['Authorization']
      });
      
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: 'Error del servidor al crear el pedido'
        }));
        
        console.error('Order creation failed:', errorData);
        
        // Mensaje específico para error 500
        if (response.status === 500) {
          return {
            success: false,
            message: 'Error en el servidor. Por favor, contacta al administrador o intenta más tarde.'
          };
        }
        
        return {
          success: false,
          message: errorData.message || 'Error al crear el pedido'
        };
      }
      
      const data = await response.json();
      console.log('Order creation response:', data);
      
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      return { 
        success: false, 
        message: 'Error de conexión al crear el pedido'
      };
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/${id}/estado`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ estado: status })
      });
      
      if (!response.ok) {
        return { success: false, message: 'Error al actualizar el estado' };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      return { 
        success: false, 
        message: 'Error al actualizar el estado' 
      };
    }
  }
};
