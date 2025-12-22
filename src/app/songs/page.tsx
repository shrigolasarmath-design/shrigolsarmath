'use client';

import { useContent } from '@/context/ContentContext';
import { useState } from 'react';

export default function SongsPage() {
  const { songs, pageBackgrounds } = useContent();
  const [playingSong, setPlayingSong] = useState<string | null>(null);

  return (
    <div 
      className="min-h-screen py-16 relative"
      style={pageBackgrounds.songsPage ? {
        backgroundImage: `url('${pageBackgrounds.songsPage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      } : { background: 'linear-gradient(to bottom, #fce7f3, #fed7aa)' }}
    >
      {pageBackgrounds.songsPage && (
        <div className="absolute inset-0 bg-black/60"></div>
      )}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slideIn">
          <h1 className={`text-5xl font-serif font-bold mb-4 ${pageBackgrounds.songsPage ? 'text-white' : 'text-pink-900'}`}>Devotional Music</h1>
          <p className={`text-xl mb-6 ${pageBackgrounds.songsPage ? 'text-white/90' : 'text-gray-700'}`}>
            Listen to sacred bhajans and spiritual chants
          </p>
          <div className={`w-20 h-1 mx-auto rounded-full ${pageBackgrounds.songsPage ? 'bg-white' : 'bg-gradient-to-r from-pink-400 to-orange-400'}`}></div>
        </div>

        {songs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-16 text-center border-t-4 border-pink-600 animate-slideIn">
            <div className="text-8xl mb-6">🎵</div>
            <p className="text-xl text-gray-600 mb-4 font-serif">
              Our music collection is being curated...
            </p>
            <p className="text-gray-500">
              Check back soon for devotional songs and bhajans!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-slideIn">
            {songs.map((song, index) => (
              <div
                key={song.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="group animate-slideIn"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-white hover:border-pink-300 transform hover:scale-105">
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-pink-100 to-orange-100">
                    {song.coverImage ? (
                      <img
                        src={song.coverImage}
                        alt={song.fileName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-9xl text-pink-600">🎵</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 bg-gradient-to-b from-white to-pink-50">
                    <h3 className="font-serif font-bold text-pink-900 text-lg mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-orange-700 transition-colors">
                      {song.fileName}
                    </h3>
                    {song.audioData && (
                      <audio
                        controls
                        className="w-full"
                        onPlay={() => setPlayingSong(song.id)}
                        onPause={() => setPlayingSong(null)}
                      >
                        <source src={song.audioData} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-pink-600 font-semibold">Audio</span>
                      {song.audioData && (
                        <a
                          href={song.audioData}
                          download={song.fileName}
                          className="bg-gradient-to-r from-pink-500 to-orange-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:from-pink-600 hover:to-orange-700 transition-all shadow-md"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
