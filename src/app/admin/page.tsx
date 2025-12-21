'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminPanel() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push('/login');
    }
  }, [mounted, isLoggedIn, router]);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  const adminOptions = [
    {
      title: 'Edit Temple History',
      description: 'Update the history and background information of the temple',
      icon: '📖',
      path: '/admin/history',
      color: 'from-orange-400 to-orange-600',
    },
    {
      title: 'Edit About',
      description: 'Update the about section information',
      icon: '✨',
      path: '/admin/about',
      color: 'from-amber-400 to-amber-600',
    },
    {
      title: 'Edit Timings',
      description: 'Update temple opening hours and timings',
      icon: '⏰',
      path: '/admin/timings',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      title: 'Manage Sevas',
      description: 'Add, edit, or remove Sevas and offerings',
      icon: '🙏',
      path: '/admin/sevas',
      color: 'from-orange-300 to-orange-500',
    },
    {
      title: 'Edit Contact Information',
      description: 'Update email, phone, address, and other contact details',
      icon: '📞',
      path: '/admin/contact',
      color: 'from-amber-300 to-amber-500',
    },
    {
      title: 'Manage Gallery',
      description: 'Upload and manage photos with captions for the gallery',
      icon: '🖼️',
      path: '/admin/gallery',
      color: 'from-yellow-300 to-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-3">Admin Dashboard</h1>
          <p className="text-lg text-amber-700">Manage your temple's content and information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => router.push(option.path)}
              className="cursor-pointer transform transition-all hover:scale-105"
            >
              <div className={`bg-gradient-to-br ${option.color} rounded-xl shadow-lg hover:shadow-2xl p-8 h-full flex flex-col items-center justify-center text-center text-white transition-all duration-300`}>
                <div className="text-6xl mb-4">{option.icon}</div>
                <h2 className="text-2xl font-bold mb-3">{option.title}</h2>
                <p className="text-sm opacity-90">{option.description}</p>
                <div className="mt-6 bg-white bg-opacity-20 px-6 py-2 rounded-full text-sm font-semibold">
                  Click to manage →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
