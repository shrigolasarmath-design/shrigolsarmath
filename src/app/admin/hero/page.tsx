'use client';

import { useContent } from '@/context/ContentContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ManageHeroPage() {
  const { heroPhotos, addHeroPhoto, deleteHeroPhoto } = useContent();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push('/login');
    }
  }, [mounted, isLoggedIn, router]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const processFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          const newPhoto = {
            id: Date.now().toString(),
            imageData: imageData,
            uploadedAt: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          };
          addHeroPhoto(newPhoto);
        };
        reader.readAsDataURL(file);
      } else {
        alert(`${file.name} is not an image. Please upload image files only.`);
      }
    });
  };

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-amber-900 to-orange-800 text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">🏛️ Shri Sadguru Pundalingeshwar Temple</h1>
          <button
            onClick={() => router.push('/admin')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded transition"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-10 border-l-4 border-orange-600">
          <h2 className="text-4xl font-bold mb-2 text-amber-900">🖼️ Manage Hero Banner Photos</h2>
          <p className="text-gray-700 mb-8 text-lg">Upload photos that will appear in the rotating banner at the top of the homepage</p>

          {/* Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-4 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-orange-600 bg-orange-50 scale-105'
                : 'border-orange-300 bg-orange-50 hover:border-orange-500'
            }`}
          >
            <div className="text-6xl mb-4">📸</div>
            <p className="text-xl font-bold text-amber-900 mb-2">Drag & drop hero banner photos here</p>
            <p className="text-gray-700 mb-4">or</p>
            <label className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition cursor-pointer">
              Browse Files
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-600 mt-4">Recommended size: 1920 x 600 pixels. Supported formats: JPG, PNG, WebP, GIF</p>
          </div>

          {/* Hero Photos List */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-amber-900 mb-6 border-b-2 border-orange-400 pb-3">
              Hero Banner Photos ({heroPhotos.length})
            </h3>

            {heroPhotos.length === 0 ? (
              <div className="text-center py-12 bg-orange-50 rounded-lg">
                <p className="text-gray-600 text-lg">No hero photos uploaded yet. Upload some to create a rotating banner!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white rounded-lg shadow-md border-2 border-orange-200 overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative w-full h-40 bg-gray-200">
                      <img
                        src={photo.imageData}
                        alt="Hero banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-orange-600 font-semibold mb-4">📅 {photo.uploadedAt}</p>
                      <button
                        onClick={() => deleteHeroPhoto(photo.id)}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h4 className="font-bold text-blue-900 mb-2">💡 Pro Tip:</h4>
            <p className="text-blue-800">Upload at least 2-3 photos to create a nice rotating effect. The banner will auto-scroll through all photos on the homepage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
