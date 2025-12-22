'use client';

import { useContent } from '@/context/ContentContext';

export default function TimingsPage() {
  const { timings, pageBackgrounds } = useContent();

  return (
    <div 
      className="min-h-screen py-16 relative"
      style={pageBackgrounds.timingsPage ? {
        backgroundImage: `url('${pageBackgrounds.timingsPage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      } : { background: 'linear-gradient(to bottom, #fed7aa, #ffffff)' }}
    >
      {pageBackgrounds.timingsPage && (
        <div className="absolute inset-0 bg-black/60"></div>
      )}
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slideIn">
          <h1 className={`text-5xl font-serif font-bold mb-4 ${pageBackgrounds.timingsPage ? 'text-white' : 'text-orange-900'}`}>Temple Timings</h1>
          <p className={`text-xl mb-6 ${pageBackgrounds.timingsPage ? 'text-white/90' : 'text-gray-700'}`}>
            Plan your visit to the temple
          </p>
          <div className={`w-20 h-1 mx-auto rounded-full ${pageBackgrounds.timingsPage ? 'bg-white' : 'bg-gradient-to-r from-orange-400 to-amber-400'}`}></div>
        </div>

        {timings.content ? (
          <div className={`p-12 rounded-2xl shadow-xl border-l-8 animate-slideIn ${pageBackgrounds.timingsPage ? 'bg-white/95 backdrop-blur-sm border-white' : 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-500'}`}>
            <p className="text-2xl text-gray-800 leading-relaxed whitespace-pre-line font-medium text-center">
              {timings.content}
            </p>
          </div>
        ) : (
          <div className={`rounded-2xl shadow-xl p-16 text-center animate-slideIn ${pageBackgrounds.timingsPage ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'}`}>
            <div className="text-7xl mb-6">🕉️</div>
            <p className="text-2xl text-gray-600 font-serif">Timings will be updated soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
