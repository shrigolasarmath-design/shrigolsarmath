'use client';

import { useContent } from '@/context/ContentContext';
import { useState, useEffect } from 'react';

export default function Home() {
  const { contactInfo, templeHistory, about, timings, sevaSection, templeBoxes, books, songs, photos, heroPhotos } = useContent();
  const [activeTab, setActiveTab] = useState('about');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Auto-scroll hero carousel
  useEffect(() => {
    if (heroPhotos.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroPhotos.length);
    }, 5000); // Change photo every 5 seconds

    return () => clearInterval(interval);
  }, [heroPhotos.length]);

  return (
    <main className="min-h-screen bg-orange-50">
      {/* Hero Section with Background Photo or Gradient */}
      {heroPhotos.length > 0 ? (
        <section 
          className="relative text-white py-32 text-center overflow-hidden w-full"
          style={{
            backgroundImage: `url('${heroPhotos[currentHeroIndex].imageData}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-6xl font-serif font-bold mb-4 tracking-wide drop-shadow-lg">Shri Sadhguru Pundalingeshwar Temple</h1>
            <p className="text-3xl font-serif font-light text-white drop-shadow-lg">Divine Seva & Worship Portal</p>
          </div>

          {/* Carousel Indicators */}
          {heroPhotos.length > 1 && (
            <div className="relative z-20 mt-8 flex justify-center gap-2">
              {heroPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHeroIndex(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === currentHeroIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 w-3 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="bg-gradient-to-b from-amber-900 via-orange-700 to-orange-600 text-white py-32 text-center w-full">
          <h1 className="text-6xl font-serif font-bold mb-4 tracking-wide">Shri Sadhguru Pundalingeshwar Temple</h1>
          <p className="text-3xl font-serif font-light">Divine Seva & Worship Portal</p>
        </section>
      )}


      {/* Main Content */}
      <div className="w-full px-4 py-12">
        <div className="max-w-7xl mx-auto">
        {/* About Tab */}
        {activeTab === 'about' && (
          <section className="bg-white rounded-lg shadow-lg p-10 border-l-4 border-orange-600">
            <h2 className="text-4xl font-bold mb-6 text-amber-900 border-b-2 border-orange-400 pb-4">About Our Temple</h2>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
              {about.content}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                <h3 className="text-2xl font-bold text-amber-900 mb-3">{templeBoxes.box1Title}</h3>
                <p className="text-gray-700">{templeBoxes.box1Content}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                <h3 className="text-2xl font-bold text-amber-900 mb-3">{templeBoxes.box2Title}</h3>
                <p className="text-gray-700">{templeBoxes.box2Content}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                <h3 className="text-2xl font-bold text-amber-900 mb-3">{templeBoxes.box3Title}</h3>
                <p className="text-gray-700">{templeBoxes.box3Content}</p>
              </div>
            </div>
          </section>
        )}

        {/* Timings Tab */}
        {activeTab === 'timings' && (
          <section className="bg-white rounded-lg shadow-lg p-10 border-l-4 border-orange-600">
            <h2 className="text-4xl font-bold mb-6 text-amber-900 border-b-2 border-orange-400 pb-4">Temple Timings</h2>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-lg text-center">
              <p className="text-2xl text-gray-800 leading-relaxed whitespace-pre-line font-medium">
                {timings.content}
              </p>
            </div>
          </section>
        )}

        {/* Sevas Tab */}
        {activeTab === 'sevas' && (
          <section className="bg-white rounded-lg shadow-lg p-10 border-l-4 border-orange-600">
            <h2 className="text-4xl font-bold mb-6 text-amber-900 border-b-2 border-orange-400 pb-4">Sevas & Offerings</h2>
            <p className="text-lg text-gray-700 mb-8">
              {sevaSection.description}
            </p>
            <small className="text-gray-600 block mb-6">* Prices are subject to change. Please confirm at the temple office for specific dates.</small>
            
            {sevaSection.sevas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-400 to-yellow-400">
                      <th className="px-6 py-4 text-left font-bold text-amber-900 border-b-2 border-orange-600">Seva Name (Ritual)</th>
                      <th className="px-6 py-4 text-left font-bold text-amber-900 border-b-2 border-orange-600">Frequency</th>
                      <th className="px-6 py-4 text-left font-bold text-amber-900 border-b-2 border-orange-600">Charges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sevaSection.sevas.map((seva) => (
                      <tr key={seva.id} className="hover:bg-orange-50 border-b border-orange-200">
                        <td className="px-6 py-4 text-gray-800 font-medium">{seva.name}</td>
                        <td className="px-6 py-4 text-gray-700">{seva.frequency}</td>
                        <td className="px-6 py-4 text-orange-600 font-bold">{seva.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-orange-50 p-8 rounded-lg text-center">
                <p className="text-gray-600">No sevas available at this time</p>
              </div>
            )}
          </section>
        )}

        {/* Booking Tab */}
        {activeTab === 'booking' && (
          <section className="bg-gradient-to-b from-orange-50 to-yellow-50 rounded-lg shadow-lg p-10 border-l-4 border-orange-600">
            <h2 className="text-4xl font-bold mb-8 text-amber-900 border-b-2 border-orange-400 pb-4">Seva Booking Form</h2>
            <form className="max-w-2xl space-y-6">
              <div>
                <label className="block font-bold text-amber-900 mb-2">Devotee Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block font-bold text-amber-900 mb-2">Gotra & Nakshatra</label>
                <input
                  type="text"
                  placeholder="e.g. Kashyapa Gotra, Rohini Nakshatra"
                  className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block font-bold text-amber-900 mb-2">Select Seva</label>
                <select className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>Select a Seva</option>
                  {sevaSection.sevas.map((seva) => (
                    <option key={seva.id}>{seva.name} - {seva.price}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-amber-900 mb-2">Seva Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block font-bold text-amber-900 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Mobile number for confirmation"
                  className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-lg hover:from-orange-600 hover:to-orange-700 text-lg transition-all shadow-lg"
              >
                Proceed to Payment / Confirmation
              </button>
            </form>
          </section>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <section className="bg-white rounded-lg shadow-lg p-10 border-l-4 border-orange-600">
            <h2 className="text-4xl font-bold mb-8 text-amber-900 border-b-2 border-orange-400 pb-4">🖼️ Temple Gallery</h2>
            
            {photos.length === 0 ? (
              <div className="text-center py-12 bg-orange-50 rounded-lg">
                <p className="text-xl text-gray-600 mb-4">📸 Gallery is being filled with sacred moments...</p>
                <p className="text-gray-500 mb-6">Check back soon for photos from our temple events and celebrations!</p>
                <a href="/gallery" className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition">
                  View Gallery
                </a>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {photos.slice(0, 3).map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-orange-100"
                    >
                      <div className="relative w-full h-48 bg-gray-200">
                        <img
                          src={photo.imageData}
                          alt={photo.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 bg-gradient-to-b from-white to-orange-50">
                        <p className="text-gray-800 mb-2 font-medium text-sm line-clamp-2">{photo.caption}</p>
                        <p className="text-xs text-orange-600 font-semibold">📅 {photo.uploadedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {photos.length > 3 && (
                  <div className="text-center">
                    <a href="/gallery" className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg text-lg">
                      ➜ View All {photos.length} Photos
                    </a>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* Books Tab */}
        {activeTab === 'books' && (
          <section className="bg-white rounded-lg shadow-lg p-10 border-l-4 border-orange-600">
            <h2 className="text-4xl font-bold mb-8 text-amber-900 border-b-2 border-orange-400 pb-4">📚 Temple Books</h2>
            
            {books.length === 0 ? (
              <div className="text-center py-12 bg-orange-50 rounded-lg">
                <p className="text-xl text-gray-600 mb-4">📖 Sacred books collection coming soon...</p>
                <p className="text-gray-500">Check back soon for available scriptures and literature.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all"
                  >
                    <div className="text-4xl mb-3">📕</div>
                    <h3 className="text-xl font-bold text-amber-900 mb-2 break-words">{book.fileName}</h3>
                    <p className="text-xs text-orange-600 font-semibold mb-4">📅 {book.uploadedAt}</p>
                    <a
                      href={book.fileData}
                      download={book.fileName}
                      className="block bg-orange-600 text-white text-center px-4 py-2 rounded font-bold hover:bg-orange-700 transition"
                    >
                      📥 Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Songs Tab */}
        {activeTab === 'songs' && (
          <section className="bg-white rounded-lg shadow-lg p-10 border-l-4 border-orange-600">
            <h2 className="text-4xl font-bold mb-8 text-amber-900 border-b-2 border-orange-400 pb-4">🎵 Devotional Songs</h2>
            
            {songs.length === 0 ? (
              <div className="text-center py-12 bg-orange-50 rounded-lg">
                <p className="text-xl text-gray-600 mb-4">🎶 Song collection coming soon...</p>
                <p className="text-gray-500">Check back soon for devotional music and chants.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all"
                  >
                    <div className="text-4xl mb-3">🎵</div>
                    <h3 className="text-lg font-bold text-amber-900 mb-2 break-words">{song.fileName}</h3>
                    <p className="text-xs text-orange-600 font-semibold mb-4">📅 {song.uploadedAt}</p>
                    <audio
                      controls
                      className="w-full mb-4 rounded"
                      controlsList="nodownload"
                    >
                      <source src={song.fileData} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <a
                      href={song.fileData}
                      download={song.fileName}
                      className="block bg-orange-600 text-white text-center px-4 py-2 rounded font-bold hover:bg-orange-700 transition"
                    >
                      📥 Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        </div>
      </div>

      {/* Contact Section - Always Visible */}
      <section className="bg-gradient-to-b from-orange-50 to-yellow-50 py-16 border-t-4 border-orange-600 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-amber-900">📞 Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-orange-500 hover:shadow-xl transition">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-3 text-amber-900">
                <span className="text-3xl">📧</span> Email
              </h3>
              <a 
                href={`mailto:${contactInfo.email}`}
                className="text-orange-600 hover:text-orange-700 break-all font-medium text-lg"
              >
                {contactInfo.email}
              </a>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-orange-500 hover:shadow-xl transition">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-3 text-amber-900">
                <span className="text-3xl">📱</span> Phone
              </h3>
              <a 
                href={`tel:${contactInfo.phone}`}
                className="text-orange-600 hover:text-orange-700 font-medium text-lg"
              >
                {contactInfo.phone}
              </a>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-orange-500 hover:shadow-xl transition">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-3 text-amber-900">
                <span className="text-3xl">📍</span> Address
              </h3>
              <p className="text-gray-700 font-medium">{contactInfo.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-8">
        <p className="font-bold text-lg">Shri Pundalingeshwar Temple</p>
        <p className="text-sm mt-2">{contactInfo.address}</p>
        <p className="text-sm">📞 {contactInfo.phone}</p>
        <p className="text-xs mt-4">© 2025 Shri Pundalingeshwar Temple. Devotion is the path to Divinity.</p>
      </footer>
    </main>
  );
}

