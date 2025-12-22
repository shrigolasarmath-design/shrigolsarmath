'use client';

import { useContent } from '@/context/ContentContext';
import Link from 'next/link';

export default function SevasPage() {
  const { sevaSection, pageBackgrounds } = useContent();

  return (
    <div 
      className="min-h-screen py-16 relative"
      style={pageBackgrounds.sevasPage ? {
        backgroundImage: `url('${pageBackgrounds.sevasPage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      } : { background: 'linear-gradient(to bottom, #fae8ff, #ffffff)' }}
    >
      {pageBackgrounds.sevasPage && (
        <div className="absolute inset-0 bg-black/60"></div>
      )}
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slideIn">
          <h1 className={`text-5xl font-serif font-bold mb-4 ${pageBackgrounds.sevasPage ? 'text-white' : 'text-amber-900'}`}>Sevas & Offerings</h1>
          <p className={`text-xl mb-6 ${pageBackgrounds.sevasPage ? 'text-white/90' : 'text-gray-700'}`}>
            {sevaSection.description || 'Participate in temple sevas and receive divine blessings'}
          </p>
          <div className={`w-20 h-1 mx-auto rounded-full mb-4 ${pageBackgrounds.sevasPage ? 'bg-white' : 'bg-gradient-to-r from-purple-400 to-orange-400'}`}></div>
          <small className={pageBackgrounds.sevasPage ? 'text-white/80' : 'text-gray-500'}>* Prices are subject to change. Please confirm at the temple office.</small>
        </div>

        {sevaSection.sevas.length > 0 ? (
          <div className={`rounded-2xl shadow-2xl overflow-hidden animate-slideIn ${pageBackgrounds.sevasPage ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-500 to-yellow-500">
                    <th className="px-8 py-5 text-left font-bold text-white text-lg">Seva Name</th>
                    <th className="px-8 py-5 text-left font-bold text-white text-lg">Frequency</th>
                    <th className="px-8 py-5 text-left font-bold text-white text-lg">Charges</th>
                  </tr>
                </thead>
                <tbody>
                  {sevaSection.sevas.map((seva, index) => (
                    <tr 
                      key={seva.id} 
                      className={`hover:bg-orange-50 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="px-8 py-5 text-gray-800 font-medium text-lg">{seva.name}</td>
                      <td className="px-8 py-5 text-gray-700">{seva.frequency}</td>
                      <td className="px-8 py-5 text-orange-600 font-bold text-lg">{seva.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-8 text-center">
              <Link href="/donate" className="inline-block bg-white text-orange-700 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                Book a Seva Online
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center animate-slideIn">
            <div className="text-7xl mb-6">🙏</div>
            <p className="text-2xl text-gray-600 font-serif">Seva details coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
