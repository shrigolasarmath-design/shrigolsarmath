// ...existing code...
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import fs from 'fs';

export default function AdminPanel() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authorizedNumbers, setAuthorizedNumbers] = useState<string[]>([]);
  const [newNumber, setNewNumber] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Check both context state and localStorage as fallback
      const isLoggedInFromStorage = localStorage.getItem('adminAuth') === 'true';
      console.log('Current isLoggedIn state:', isLoggedIn);
      console.log('isLoggedInFromStorage:', isLoggedInFromStorage);
      console.log('localStorage adminAuth:', localStorage.getItem('adminAuth'));
      
      const isAuthenticated = isLoggedIn || isLoggedInFromStorage;
      
      if (!isAuthenticated) {
        console.log('Redirecting to admin login due to unauthenticated state');
        router.push('/admin/login');
      } else {
        console.log('Admin is authenticated, staying on dashboard');
      }
    }
  }, [mounted, isLoggedIn, router]);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  // Check both context and localStorage for authentication
  const isLoggedInFromStorage = localStorage.getItem('adminAuth') === 'true';
  if (!isLoggedIn && !isLoggedInFromStorage) {
    return null;
  }

  // Handler to add a new authorized number
  const handleAddNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    const phone = newNumber.trim();
    if (!/^\\d{10}$/.test(phone)) {
      setAuthError('Enter a valid 10-digit number');
      return;
    }
    if (authorizedNumbers.includes(phone)) {
      setAuthError('Number already authorized');
      return;
    }
    // Call API to add number
    const res = await fetch('/api/authorized-numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (data.success) {
      setAuthorizedNumbers(data.numbers);
      setAuthSuccess('Number added successfully!');
      setNewNumber('');
    } else {
      setAuthError(data.error || 'Failed to add number');
    }
  };

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
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminOptions.map((option) => (
          <div
            key={option.title}
            className={`p-4 rounded-lg bg-gradient-to-r ${option.color} text-white shadow-md cursor-pointer`}
            onClick={() => router.push(option.path)}
          >
            <h2 className="text-xl font-semibold">{option.icon} {option.title}</h2>
            <p className="text-sm mt-2">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
