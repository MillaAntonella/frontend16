'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';
import { authAPI } from '@/lib/api/auth';

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigo_postal: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        setUser(response.data);
        setFormData({
          nombre: response.data.nombre || '',
          telefono: response.data.telefono || '',
          direccion: response.data.direccion || '',
          ciudad: response.data.ciudad || '',
          codigo_postal: response.data.codigo_postal || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      
      if (response.success) {
        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('✅ Perfil actualizado exitosamente');
        setEditing(false);
      }
    } catch (error) {
      alert('❌ Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">👤 Mi Perfil</h1>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {!editing ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{user?.nombre}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    {user?.rol === 'admin' && (
                      <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        👑 Administrador
                      </span>
                    )}
                  </div>
                  <Button onClick={() => setEditing(true)}>
                    ✏️ Editar
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600">Teléfono</label>
                    <p className="font-semibold">{user?.telefono || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ciudad</label>
                    <p className="font-semibold">{user?.ciudad || 'No especificado'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600">Dirección</label>
                    <p className="font-semibold">{user?.direccion || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Código Postal</label>
                    <p className="font-semibold">{user?.codigo_postal || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Miembro desde</label>
                    <p className="font-semibold">
                      {new Date(user?.fecha_registro).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre completo</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dirección</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ciudad</label>
                    <input
                      type="text"
                      value={formData.ciudad}
                      onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Código Postal</label>
                    <input
                      type="text"
                      value={formData.codigo_postal}
                      onChange={(e) => setFormData({...formData, codigo_postal: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" loading={loading} fullWidth>
                    💾 Guardar Cambios
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditing(false);
                      fetchProfile();
                    }}
                    fullWidth
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
