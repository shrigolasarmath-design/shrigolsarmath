'use client';

import { useContent } from '@/context/ContentContext';
import { useState } from 'react';
import AdminProtected from '@/components/AdminProtected';

export default function PageBackgroundsPage() {
  const { pageBackgrounds, updatePageBackground } = useContent();
  const [uploading, setUploading] = useState<string | null>(null);

  const pages = [
    { key: 'aboutPage' as const, title: 'About Page', icon: '✨', color: 'from-amber-400 to-amber-600' },
    { key: 'timingsPage' as const, title: 'Timings Page', icon: '⏰', color: 'from-orange-400 to-orange-600' },
    { key: 'sevasPage' as const, title: 'Sevas Page', icon: '🙏', color: 'from-purple-400 to-purple-600' },
    { key: 'galleryPage' as const, title: 'Gallery Page', icon: '📸', color: 'from-green-400 to-green-600' },
    { key: 'booksPage' as const, title: 'Books Page', icon: '📚', color: 'from-blue-400 to-blue-600' },
    { key: 'songsPage' as const, title: 'Songs Page', icon: '🎵', color: 'from-pink-400 to-pink-600' },
  ];

  const handleFileUpload = (pageKey: keyof typeof pageBackgrounds, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(pageKey);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updatePageBackground(pageKey, base64String);
      setUploading(null);
    };
    reader.onerror = () => {
      alert('Failed to upload image');
      setUploading(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (pageKey: keyof typeof pageBackgrounds) => {
    if (confirm(`Remove background image for ${pageKey}?`)) {
      updatePageBackground(pageKey, '');
    }
  };

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-amber-900 mb-2">Page Backgrounds</h1>
              <p className="text-gray-600">Upload parallax background images for individual pages</p>
            </div>

            {/* Tips Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-3">💡 Background Image Tips:</h3>
              <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                <li>Recommended size: 1920x1080 pixels or higher resolution</li>
                <li>Use high-quality images for best parallax effect</li>
                <li>Images will stay fixed while content scrolls over them</li>
                <li>Dark overlay is automatically applied for text readability</li>
                <li>Maximum file size: 5MB per image</li>
              </ul>
            </div>

            {/* Upload Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <div
                  key={page.key}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`text-4xl w-16 h-16 rounded-lg bg-gradient-to-br ${page.color} flex items-center justify-center shadow-lg`}>
                      {page.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{page.title}</h3>
                  </div>

                  {pageBackgrounds[page.key] ? (
                    <div className="space-y-3">
                      <div className="relative h-40 rounded-lg overflow-hidden border-2 border-gray-300">
                        <img
                          src={pageBackgrounds[page.key]}
                          alt={`${page.title} background`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white font-semibold">Preview</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(page.key)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Remove Background
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="h-40 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <p className="text-gray-400 text-sm">No background set</p>
                      </div>
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(page.key, e)}
                          disabled={uploading === page.key}
                          className="hidden"
                        />
                        <div className={`w-full bg-gradient-to-r ${page.color} hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold text-center cursor-pointer transition-opacity`}>
                          {uploading === page.key ? 'Uploading...' : 'Upload Background'}
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminProtected>
  );
}
