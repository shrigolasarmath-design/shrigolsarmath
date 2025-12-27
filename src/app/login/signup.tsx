"use client";

import { useState } from 'react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup logic
    console.log({ username, password, email });
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-16">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-2xl p-10 border-t-4 border-indigo-600">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 text-indigo-900">Sign Up</h1>
            <p className="text-gray-700 text-lg">Create an account to book sevas and donate.</p>
          </div>

          {success ? (
            <div className="bg-green-100 border-2 border-green-500 text-green-900 px-6 py-6 rounded-lg text-center shadow-md">
              <h2 className="text-2xl font-bold mb-3">🎉 Signup Successful!</h2>
              <p className="text-lg">You can now log in with your credentials.</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-lg font-semibold text-indigo-900 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-5 py-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-indigo-50 text-gray-800 font-medium"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-lg font-semibold text-indigo-900 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-5 py-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-indigo-50 text-gray-800 font-medium"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-lg font-semibold text-indigo-900 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-5 py-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-indigo-50 text-gray-800 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg"
              >
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}