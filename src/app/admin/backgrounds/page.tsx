'use client';

import { useContent } from '@/context/ContentContext';
import { useState } from 'react';

export default function BackgroundsAdmin() {
  const { sectionBackgrounds, updateSectionBackground } = useContent();
  const [uploading, setUploading] = useState<string | null>(null);

  const handleImageUpload = async (section: keyof typeof sectionBackgrounds, file: File) => {
    setUploading(section);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateSectionBackground(section, base64String);
      setUploading(null);
    };
    reader.readAsDataURL(file);
  };

  const sections = [
    { key: 'aboutBg' as const, label: 'About Section Background' },
    { key: 'timingsBg' as const, label: 'Temple Timings Background' },
    { key: 'sevasBg' as const, label: 'Sevas Section Background' },
    { key: 'galleryBg' as const, label: 'Gallery Preview Background' },
    { key: 'booksBg' as const, label: 'Books Preview Background' },
    { key: 'songsBg' as const, label: 'Songs Preview Background' },
  ];

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-amber-900 mb-8">Section Background Images</h1>
        <p className="text-gray-600 mb-8">Upload background images for different sections. These will appear with a parallax scroll effect.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section) => (
            <div key={section.key} className="bg-white rounded-lg shadow-lg p-6 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-amber-900 mb-4">{section.label}</h3>
              
              {sectionBackgrounds[section.key] && (
                <div className="mb-4 relative h-48 rounded-lg overflow-hidden border-2 border-orange-300">
                  <img
                    src={sectionBackgrounds[section.key]}
                    alt={section.label}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => updateSectionBackground(section.key, '')}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition"
                  >
                    ✕
                  </button>
                </div>
              )}

              <label className="block">
                <span className="sr-only">Choose background image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(section.key, file);
                    }
                  }}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-orange-500 file:to-orange-600 file:text-white hover:file:from-orange-600 hover:file:to-orange-700 file:cursor-pointer cursor-pointer"
                  disabled={uploading === section.key}
                />
              </label>

              {uploading === section.key && (
                <p className="text-orange-600 mt-2">Uploading...</p>
              )}

              {!sectionBackgrounds[section.key] && uploading !== section.key && (
                <p className="text-gray-500 text-sm mt-2">No background image set</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="font-bold text-blue-900 mb-2">💡 Tips:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Use high-resolution images (1920x1080 or larger) for best quality</li>
            <li>Images will have a parallax effect - they stay fixed while content scrolls</li>
            <li>Dark overlays will be applied automatically for text readability</li>
            <li>Landscape orientation works best for section backgrounds</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
