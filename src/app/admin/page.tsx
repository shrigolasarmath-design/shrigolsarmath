'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminPanel() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      title: 'Edit Hero Banner',
      description: 'Upload and manage rotating hero banner photos on the homepage',
      icon: '🖼️',
      path: '/admin/hero',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      title: 'Banner Logo Settings',
      description: 'Upload a logo for the navigation banner',
      icon: '🏛️',
      path: '/admin/banner',
      color: 'from-indigo-400 to-indigo-600',
    },
    {
      title: 'Manage Gallery',
      description: 'Upload and manage temple gallery photos',
      icon: '📸',
      path: '/admin/gallery',
      color: 'from-green-400 to-green-600',
    },
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
      title: 'Edit About Boxes',
      description: 'Edit the three information boxes on your About section',
      icon: '📦',
      path: '/admin/boxes',
      color: 'from-red-400 to-red-600',
    },
    {
      title: 'Manage Books',
      description: 'Upload and manage temple books and scriptures',
      icon: '📚',
      path: '/admin/books',
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Manage Songs',
      description: 'Upload and manage devotional songs and audio files',
      icon: '🎵',
      path: '/admin/songs',
      color: 'from-pink-400 to-pink-600',
    },
    {
      title: 'Section Backgrounds',
      description: 'Upload parallax background images for different sections',
      icon: '🌄',
      path: '/admin/backgrounds',
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Page Backgrounds',
      description: 'Upload background images for individual pages',
      icon: '🖼️',
      path: '/admin/page-backgrounds',
      color: 'from-teal-400 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-900 to-orange-800 text-white py-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white text-3xl hover:bg-white/20 p-2 rounded transition"
            >
              ☰
            </button>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 transition shadow-lg"
          >
            ← Back to Main Site
          </button>
        </div>
      </header>

      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 top-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-16 h-screen w-64 bg-amber-800 shadow-xl transition-transform duration-300 z-35 flex flex-col overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex-1">
          {adminOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                router.push(option.path);
                setSidebarOpen(false);
              }}
              className="w-full px-6 py-4 text-white font-bold text-lg transition-all flex items-center gap-3 hover:bg-amber-700 border-b border-amber-700"
            >
              <span className="text-2xl">{option.icon}</span>
              <span className="text-left text-sm">{option.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div>
            <p className="text-lg text-amber-700">Manage your temple's content and information</p>
          </div>
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
