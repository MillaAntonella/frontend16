import apiClient from './axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const editorialsAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/editoriales`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching editorials:', error);
      return { success: false, data: [] };
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/editoriales/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching editorial:', error);
      return { success: false, data: null };
    }
  },

  create: async (editorialData) => {
    try {
      const response = await apiClient.post('/editoriales', editorialData);
      return response.data;
    } catch (error) {
      console.error('Error creating editorial:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/editoriales/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting editorial:', error);
      throw error;
    }
  },
};
