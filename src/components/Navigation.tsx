'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Navigation() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const tabs = [
    { id: 'about', label: 'About', icon: 'ℹ️' },
    { id: 'timings', label: 'Timings', icon: '⏰' },
    { id: 'sevas', label: 'Seva List', icon: '🙏' },
    { id: 'booking', label: 'Book Now', icon: '📝' },
    { id: 'books', label: 'Books', icon: '📚' },
    { id: 'songs', label: 'Songs', icon: '🎵' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
  ];

  return (
    <>
      <nav className="bg-gradient-to-r from-amber-900 to-amber-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white text-3xl hover:bg-white/20 p-2 rounded transition"
              >
                ☰
              </button>
              <Link href="/" className="text-2xl font-bold tracking-wide hover:text-yellow-300 transition">
                Shri Sadhguru Pundalingeshwar Temple
              </Link>
            </div>
            <div className="flex gap-6 items-center">
              {isLoggedIn ? (
                <>
                  <Link href="/admin" className="hover:text-yellow-300 px-3 py-2 rounded font-medium transition">
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-medium transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded font-bold transition">
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 top-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-screen w-64 bg-amber-800 shadow-xl transition-transform duration-300 z-35 flex flex-col overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Items */}
        <nav className="flex-1 pt-6">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/#${tab.id}`}
              onClick={() => setSidebarOpen(false)}
              className="block w-full px-6 py-4 text-white font-bold text-lg transition-all hover:bg-amber-700"
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="ml-3">{tab.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
