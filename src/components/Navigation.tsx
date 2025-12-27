'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Navigation() {
  const { isLoggedIn, logout, isUserLoggedIn, logoutUser } = useAuth();
  const { bannerSettings } = useContent();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAdminLogout = () => {
    logout();
    router.push('/');
  };

  const handleUserLogout = () => {
    logoutUser();
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/timings', label: 'Timings' },
    { href: '/sevas', label: 'Seva List' },
    { href: '/donate', label: 'Book Now' },
    { href: '/books', label: 'Books' },
    { href: '/songs', label: 'Songs' },
    { href: '/gallery', label: 'Gallery' },
  ];

  return (
    <>
      <nav
        className="relative text-white shadow-lg sticky top-0 z-50"
        style={bannerSettings.image ? {
          backgroundImage: `url('${bannerSettings.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-amber-800 opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 py-3 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white text-3xl hover:bg-white/20 p-2 rounded transition flex-shrink-0"
              >
                ☰
              </button>
              {bannerSettings.logo ? (
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                  <img 
                    src={bannerSettings.logo} 
                    alt="Temple Logo" 
                    className="h-12 w-auto object-contain"
                  />
                  <span className="text-xl md:text-2xl font-bold tracking-wide hidden sm:inline">
                    {bannerSettings.text || 'Shri Sadguru Pundalingeshwar Temple'}
                  </span>
                </Link>
              ) : (
                <Link href="/" className="text-xl md:text-2xl font-bold tracking-wide hover:text-yellow-300 transition">
                  {bannerSettings.text || 'Shri Sadguru Pundalingeshwar Temple'}
                </Link>
              )}
            </div>
            <div className="flex gap-3 md:gap-6 items-center">
              {isLoggedIn ? (
                <>
                  <Link href="/admin" className="hover:text-yellow-300 px-2 md:px-3 py-2 rounded font-medium transition text-sm md:text-base">
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleAdminLogout}
                    className="bg-red-600 hover:bg-red-700 px-3 md:px-4 py-2 rounded font-medium transition text-sm md:text-base"
                  >
                    Admin Logout
                  </button>
                </>
              ) : isUserLoggedIn ? (
                <>
                  <Link href="/transaction-history" className="bg-green-600 hover:bg-green-700 px-3 md:px-4 py-2 rounded font-medium transition text-sm md:text-base">
                    Transaction History
                  </Link>
                  <button
                    onClick={handleUserLogout}
                    className="bg-red-600 hover:bg-red-700 px-3 md:px-4 py-2 rounded font-medium transition text-sm md:text-base"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/admin/login" className="bg-orange-600 hover:bg-orange-700 px-3 md:px-4 py-2 rounded font-bold transition text-sm md:text-base">
                    Admin Login
                  </Link>
                  <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-3 md:px-4 py-2 rounded font-bold transition text-sm md:text-base">
                    User Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-amber-800 shadow-2xl transition-transform duration-300 z-50 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="bg-amber-900 p-4 flex justify-between items-center border-b border-amber-700">
          <h2 className="text-white font-bold text-lg">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white text-2xl hover:bg-white/20 p-1 rounded transition"
          >
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 pt-2 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className="block w-full px-6 py-4 text-white font-serif font-semibold text-lg transition-all hover:bg-amber-700 border-b border-amber-700/30"
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Donate Button */}
        <div className="p-4 border-t border-amber-700 bg-amber-900/50">
          <Link
            href="/donate"
            onClick={() => setSidebarOpen(false)}
            className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-center px-6 py-3 rounded-lg font-bold text-base transition-all shadow-lg"
          >
            💰 Donate Now
          </Link>
        </div>
      </aside>
    </>
  );
}
