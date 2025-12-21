'use client';

import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditAboutPage() {
  const { isLoggedIn } = useAuth();
  const { about, updateAbout } = useContent();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setMounted(true);
    setContent(about.content);
  }, [about]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Please enter the about information');
      return;
    }

    updateAbout({ content });
    showSuccess('About section updated successfully!');
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-amber-900 mb-2">✨ Edit About Section</h1>
          <p className="text-lg text-amber-700">Update information about your temple</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 font-semibold">
            ✓ {successMessage}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-amber-900 mb-3">
                About Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter information about your temple..."
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none font-medium text-gray-800"
                rows={10}
              />
              <p className="mt-2 text-sm text-gray-600">
                Characters: {content.length}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-bold text-lg shadow-md hover:shadow-lg"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="px-6 bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
