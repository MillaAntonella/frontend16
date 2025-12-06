'use client';
import { useState, useEffect } from 'react';
import { authAPI } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userData && token) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    }
  };

  const register = async (data) => {
    try {
      const response = await authAPI.register(data);
      
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al registrarse' 
      };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  const isAdmin = () => {
    return user?.rol === 'admin';
  };

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    checkAuth,
  };
};
