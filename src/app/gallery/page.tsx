'use client';

import { useContent } from '@/context/ContentContext';
import Image from 'next/image';

export default function GalleryPage() {
  const { photos } = useContent();

  return (
    <div className="min-h-screen bg-stone-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-amber-900">🖼️ Temple Gallery</h1>
          <p className="text-xl text-gray-700">
            Sacred moments and divine celebrations
          </p>
        </div>

        {photos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-16 text-center border-t-4 border-yellow-600">
            <p className="text-xl text-gray-600 mb-4">
              📸 Gallery is being filled with sacred moments...
            </p>
            <p className="text-gray-500">
              Check back soon for photos from our temple events and celebrations!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-yellow-100"
              >
                <div className="relative w-full h-72 bg-gray-200">
                  <img
                    src={photo.imageData}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 bg-gradient-to-b from-white to-yellow-50">
                  <p className="text-gray-800 mb-3 font-medium text-lg">{photo.caption}</p>
                  <p className="text-sm text-amber-600 font-semibold">📅 {photo.uploadedAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
