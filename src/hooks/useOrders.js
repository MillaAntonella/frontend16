'use client';
import { useState, useEffect } from 'react';
import { ordersAPI } from '@/lib/api/orders';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getMyOrders();
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    try {
      const response = await ordersAPI.create(orderData);
      if (response.success) {
        await fetchOrders(); // Refresh orders
      }
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        message: 'Error al crear el pedido'
      };
    }
  };

  return {
    orders,
    loading,
    createOrder,
    refreshOrders: fetchOrders
  };
}
