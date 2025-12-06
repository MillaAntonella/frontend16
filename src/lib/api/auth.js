const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const authAPI = {
  login: async (credentials) => {
    try {
      console.log('Intentando login con:', { email: credentials.email });
      console.log('URL:', `${API_URL}/auth/login`);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
  }
};
