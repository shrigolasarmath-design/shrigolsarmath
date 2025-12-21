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
      setError('Invalid username or password. Use admin / admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold px-4 py-2 rounded-lg bg-white shadow hover:shadow-lg transition"
        >
          ← Back to Main Site
        </button>
      </div>

      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md border-t-4 border-orange-600">
        <h1 className="text-3xl font-bold mb-2 text-center text-amber-900">🔐 Admin Login</h1>
        <p className="text-center text-gray-600 mb-6">Manage your temple's content</p>
        
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-amber-900 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-medium"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-amber-900 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-medium"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-bold text-lg shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>

        <div className="mt-6 p-4 bg-orange-50 rounded-lg text-sm border-l-4 border-orange-500">
          <p className="font-bold text-amber-900 mb-2">Demo Credentials:</p>
          <p className="text-gray-700">Username: <code className="bg-white px-2 py-1 rounded font-bold text-amber-900">admin</code></p>
          <p className="text-gray-700">Password: <code className="bg-white px-2 py-1 rounded font-bold text-amber-900">admin123</code></p>
        </div>
      </div>
    </div>
  );
}
