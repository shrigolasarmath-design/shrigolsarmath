'use client';

import { useContent } from '@/context/ContentContext';

export default function AboutPage() {
  const { aboutSection, pageBackgrounds } = useContent();

  return (
    <div 
      className="min-h-screen py-16 relative"
      style={pageBackgrounds.aboutPage ? {
        backgroundImage: `url('${pageBackgrounds.aboutPage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      } : { background: 'linear-gradient(to bottom, #fef3c7, #ffffff)' }}
    >
      {pageBackgrounds.aboutPage && (
        <div className="absolute inset-0 bg-black/60"></div>
      )}
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slideIn">
          <h1 className={`text-5xl font-serif font-bold mb-4 ${pageBackgrounds.aboutPage ? 'text-white' : 'text-amber-900'}`}>About Our Temple</h1>
          <div className={`w-20 h-1 mx-auto rounded-full ${pageBackgrounds.aboutPage ? 'bg-white' : 'bg-gradient-to-r from-amber-400 to-orange-400'}`}></div>
        </div>

        <div className={`rounded-2xl shadow-2xl overflow-hidden animate-slideIn ${pageBackgrounds.aboutPage ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'}`}>
          <div className="p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-xl whitespace-pre-wrap font-serif">
                {aboutSection.content || 'Welcome to Shri Sadguru Pundalingeshwar Temple. Our temple is a sacred space where devotees come to seek blessings and find spiritual peace.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
