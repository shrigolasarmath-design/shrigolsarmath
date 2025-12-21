'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function Navigation() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-gradient-to-r from-amber-900 to-amber-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-wide hover:text-yellow-300 transition">
            🏛️ Shri Pundalingeshwar Temple
          </Link>
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
  );
}
