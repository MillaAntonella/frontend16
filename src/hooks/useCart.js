'use client';
import { useState, useEffect } from 'react';
import { cartAPI } from '@/lib/api/cart';

export function useCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartAPI.get();
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const response = await cartAPI.updateItem(itemId, quantity);
      if (response.success) {
        await fetchCart();
      }
      return response;
    } catch (error) {
      console.error('Error updating item:', error);
      return { success: false };
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await cartAPI.removeItem(itemId);
      if (response.success) {
        await fetchCart();
      }
      return response;
    } catch (error) {
      console.error('Error removing item:', error);
      return { success: false };
    }
  };

  const addItem = async (bookId, quantity = 1) => {
    try {
      const response = await cartAPI.addItem(bookId, quantity);
      if (response.success) {
        await fetchCart();
      }
      return response;
    } catch (error) {
      console.error('Error adding item:', error);
      return { success: false };
    }
  };

  return {
    cart,
    loading,
    updateItem,
    removeItem,
    addItem,
    refreshCart: fetchCart
  };
}
