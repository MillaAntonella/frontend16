'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import Loading from '@/components/common/Loading';
import { ordersAPI } from '@/lib/api/orders';
import { formatPrice, formatDate } from '@/lib/utils/formatters';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils/constants';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const response = await ordersAPI.getById(params.id);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Loading fullScreen />
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Pedido no encontrado</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Pedido #{order.numero_pedido}
              </h1>
              <p className="text-gray-600 mt-2">{formatDate(order.fecha_pedido)}</p>
            </div>
            
            <span 
              className="px-6 py-3 rounded-full text-lg font-semibold text-white"
              style={{ backgroundColor: ORDER_STATUS_COLORS[order.estado] }}
            >
              {ORDER_STATUS_LABELS[order.estado]}
            </span>
          </div>

          {/* Información de envío */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">📍 Información de Envío</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Dirección</p>
                <p className="font-semibold">{order.direccion_envio}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Ciudad</p>
                <p className="font-semibold">{order.ciudad_envio}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Código Postal</p>
                <p className="font-semibold">{order.codigo_postal_envio}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Teléfono</p>
                <p className="font-semibold">{order.telefono_contacto}</p>
              </div>
            </div>
          </div>

          {/* Items del pedido */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">📚 Productos</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id_item} className="flex gap-4 border-b pb-4">
                  <div className="w-20 h-28 bg-linear-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">📚</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.titulo}</h3>
                    <p className="text-gray-600 text-sm">Por {item.autor_nombre}</p>
                    <p className="text-gray-600 mt-2">
                      Cantidad: {item.cantidad} × {formatPrice(item.precio_unitario)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-purple-600">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">💰 Resumen</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos</span>
                <span>{formatPrice(order.impuestos)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>{formatPrice(order.costo_envio)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-2xl font-bold text-purple-600">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
