'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.rol !== 'admin') {
      alert('Acceso denegado. Solo administradores.');
      router.push('/');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
