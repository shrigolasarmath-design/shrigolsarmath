'use client';

import { useContent } from '@/context/ContentContext';

export default function BooksPage() {
  const { books, pageBackgrounds } = useContent();

  return (
    <div 
      className="min-h-screen py-16 relative"
      style={pageBackgrounds.booksPage ? {
        backgroundImage: `url('${pageBackgrounds.booksPage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      } : { background: 'linear-gradient(to bottom, #fef3c7, #fed7aa)' }}
    >
      {pageBackgrounds.booksPage && (
        <div className="absolute inset-0 bg-black/60"></div>
      )}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slideIn">
          <h1 className={`text-5xl font-serif font-bold mb-4 ${pageBackgrounds.booksPage ? 'text-white' : 'text-amber-900'}`}>Sacred Literature</h1>
          <p className={`text-xl mb-6 ${pageBackgrounds.booksPage ? 'text-white/90' : 'text-gray-700'}`}>
            Explore spiritual wisdom and ancient texts
          </p>
          <div className={`w-20 h-1 mx-auto rounded-full ${pageBackgrounds.booksPage ? 'bg-white' : 'bg-gradient-to-r from-amber-400 to-orange-400'}`}></div>
        </div>

        {books.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-16 text-center border-t-4 border-amber-600 animate-slideIn">
            <div className="text-8xl mb-6">📚</div>
            <p className="text-xl text-gray-600 mb-4 font-serif">
              Our sacred library is being prepared...
            </p>
            <p className="text-gray-500">
              Check back soon for spiritual texts and devotional literature!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-slideIn">
            {books.map((book, index) => (
              <a
                key={book.id}
                href={book.fileData}
                download={book.fileName}
                style={{ animationDelay: `${index * 50}ms` }}
                className="group animate-slideIn"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-white hover:border-amber-300 transform hover:scale-105">
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.fileName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-9xl text-amber-600">📖</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 bg-gradient-to-b from-white to-amber-50">
                    <h3 className="font-serif font-bold text-amber-900 text-lg mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-orange-700 transition-colors">
                      {book.fileName}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-orange-600 font-semibold">PDF</span>
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-full text-sm font-bold group-hover:from-orange-600 group-hover:to-orange-700 transition-all shadow-md">
                        Download
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
