'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const success = login(username, password);
    if (success) {
      router.push('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-amber-900 to-orange-800 text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">🏛️ Shri Sadguru Pundalingeshwar Temple</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded transition"
          >
            ← Back
          </button>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-screen bg-orange-50 p-4">
        <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md border-t-8 border-orange-600">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-amber-900 mb-2">🔐 Admin Login</h2>
            <p className="text-gray-700 font-medium">Manage your temple's content</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 text-red-800 px-5 py-4 rounded mb-6 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-amber-900 font-bold mb-2 text-lg">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 border-2 border-yellow-400 rounded focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-300 font-medium text-gray-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-amber-900 font-bold mb-2 text-lg">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-yellow-400 rounded focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-300 font-medium text-gray-800 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded text-lg transition shadow-lg"
            >
              Login
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
