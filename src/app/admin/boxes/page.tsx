'use client';

import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditBoxesPage() {
  const { isLoggedIn } = useAuth();
  const { templeBoxes, updateTempleBoxes } = useContent();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [box1Title, setBox1Title] = useState('');
  const [box1Content, setBox1Content] = useState('');
  const [box2Title, setBox2Title] = useState('');
  const [box2Content, setBox2Content] = useState('');
  const [box3Title, setBox3Title] = useState('');
  const [box3Content, setBox3Content] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setMounted(true);
    setBox1Title(templeBoxes.box1Title);
    setBox1Content(templeBoxes.box1Content);
    setBox2Title(templeBoxes.box2Title);
    setBox2Content(templeBoxes.box2Content);
    setBox3Title(templeBoxes.box3Title);
    setBox3Content(templeBoxes.box3Content);
  }, [templeBoxes]);

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
    
    if (!box1Title.trim() || !box1Content.trim() || !box2Title.trim() || !box2Content.trim() || !box3Title.trim() || !box3Content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    updateTempleBoxes({
      box1Title,
      box1Content,
      box2Title,
      box2Content,
      box3Title,
      box3Content,
    });
    
    showSuccess('Information boxes updated successfully!');
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-amber-900 mb-2">📦 Edit Information Boxes</h1>
          <p className="text-lg text-amber-700">Edit the three information boxes on your About section</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 font-semibold">
            ✓ {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Box 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Box 1</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-amber-900 mb-2">Title</label>
                <input
                  type="text"
                  value={box1Title}
                  onChange={(e) => setBox1Title(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-medium text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-amber-900 mb-2">Content</label>
                <textarea
                  value={box1Content}
                  onChange={(e) => setBox1Content(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-medium text-gray-800"
                  rows={5}
                />
              </div>
            </div>
          </div>

          {/* Box 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Box 2</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-amber-900 mb-2">Title</label>
                <input
                  type="text"
                  value={box2Title}
                  onChange={(e) => setBox2Title(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-medium text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-amber-900 mb-2">Content</label>
                <textarea
                  value={box2Content}
                  onChange={(e) => setBox2Content(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-medium text-gray-800"
                  rows={5}
                />
              </div>
            </div>
          </div>

          {/* Box 3 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Box 3</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-amber-900 mb-2">Title</label>
                <input
                  type="text"
                  value={box3Title}
                  onChange={(e) => setBox3Title(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-medium text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-amber-900 mb-2">Content</label>
                <textarea
                  value={box3Content}
                  onChange={(e) => setBox3Content(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-medium text-gray-800"
                  rows={5}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-bold text-lg shadow-md hover:shadow-lg"
          >
            Save All Changes
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="px-6 bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 transition-all font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
