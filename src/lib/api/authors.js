import apiClient from './axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const authorsAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/autores`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching authors:', error);
      return { success: false, data: [] };
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/autores/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching author:', error);
      return { success: false, data: null };
    }
  },

  create: async (authorData) => {
    try {
      const response = await apiClient.post('/autores', authorData);
      return response.data;
    } catch (error) {
      console.error('Error creating author:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/autores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting author:', error);
      throw error;
    }
  },
};
