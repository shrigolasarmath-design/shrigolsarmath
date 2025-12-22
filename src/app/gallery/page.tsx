'use client';

import { useContent } from '@/context/ContentContext';
import { useState } from 'react';

export default function GalleryPage() {
  const { photos, pageBackgrounds } = useContent();
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [filter, setFilter] = useState('all');

  return (
    <div 
      className="min-h-screen py-16 relative"
      style={pageBackgrounds.galleryPage ? {
        backgroundImage: `url('${pageBackgrounds.galleryPage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      } : { background: 'linear-gradient(to bottom, #fed7aa, #fef3c7)' }}
    >
      {pageBackgrounds.galleryPage && (
        <div className="absolute inset-0 bg-black/60"></div>
      )}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slideIn">
          <h1 className={`text-5xl font-serif font-bold mb-4 ${pageBackgrounds.galleryPage ? 'text-white' : 'text-amber-900'}`}>Temple Gallery</h1>
          <p className={`text-xl mb-6 ${pageBackgrounds.galleryPage ? 'text-white/90' : 'text-gray-700'}`}>
            Sacred moments and divine celebrations
          </p>
          <div className={`w-20 h-1 mx-auto rounded-full ${pageBackgrounds.galleryPage ? 'bg-white' : 'bg-gradient-to-r from-orange-400 to-yellow-400'}`}></div>
        </div>

        {photos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-16 text-center border-t-4 border-yellow-600 animate-slideIn">
            <p className="text-xl text-gray-600 mb-4 font-serif">
              Gallery is being filled with sacred moments...
            </p>
            <p className="text-gray-500">
              Check back soon for photos from our temple events and celebrations!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slideIn">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer border-2 border-yellow-100 transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-orange-400 group animate-slideIn hover:-translate-y-2"
                >
                  <div className="relative w-full h-72 bg-gray-200 overflow-hidden">
                    <img
                      src={photo.imageData}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white text-3xl font-serif font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">View</span>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-b from-white to-yellow-50">
                    <p className="text-gray-800 mb-3 font-medium text-lg group-hover:text-orange-700 transition-colors line-clamp-2">{photo.caption}</p>
                    <p className="text-sm text-amber-600 font-semibold">{photo.uploadedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Photo Modal/Lightbox */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedPhoto(null)}>
            <div className="bg-white rounded-lg overflow-hidden max-w-3xl w-full transform transition-all duration-300 scale-100 animate-slideIn" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <img
                  src={selectedPhoto.imageData}
                  alt={selectedPhoto.caption}
                  className="w-full h-auto max-h-96 object-cover"
                />
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all text-lg font-bold hover:scale-110 shadow-lg"
                >
                  ✕
                </button>
              </div>
              <div className="p-8 bg-gradient-to-b from-white to-yellow-50">
                <p className="text-gray-800 mb-3 font-medium text-xl">{selectedPhoto.caption}</p>
                <p className="text-sm text-amber-600 font-semibold">Uploaded: {selectedPhoto.uploadedAt}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
