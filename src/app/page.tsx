'use client';

import { useContent } from '@/context/ContentContext';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const { contactInfo, templeHistory, about, timings, sevaSection, templeBoxes, books, songs, photos, heroPhotos, sectionBackgrounds } = useContent();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  // Auto-scroll hero carousel
  useEffect(() => {
    if (heroPhotos.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroPhotos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroPhotos.length]);

  // Auto-scroll temple boxes carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBoxIndex((prev) => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-orange-50">
      {/* Hero Section with Background Photo */}
      {heroPhotos.length > 0 ? (
        <section 
          className="relative text-white py-40 text-center overflow-hidden w-full min-h-[600px] flex items-center justify-center"
          style={{
            backgroundImage: `url('${heroPhotos[currentHeroIndex].imageData}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>

          <div className="relative z-10 max-w-5xl mx-auto px-4">
            <h1 className="text-7xl font-serif font-bold mb-6 tracking-wide drop-shadow-2xl animate-fadeIn">
              Shri Sadguru Pundalingeshwar Temple
            </h1>
            <p className="text-4xl font-serif font-light text-white/95 drop-shadow-lg mb-8 animate-slideIn">
              Divine Seva & Worship Portal
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <a href="#about" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105">
                Learn More
              </a>
            </div>
          </div>

          {heroPhotos.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex justify-center gap-3">
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
        <section className="bg-gradient-to-b from-amber-900 via-orange-700 to-orange-600 text-white py-40 text-center w-full min-h-[600px] flex items-center justify-center">
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-7xl font-serif font-bold mb-6 tracking-wide animate-fadeIn">
              Shri Sadguru Pundalingeshwar Temple
            </h1>
            <p className="text-4xl font-serif font-light mb-8 animate-slideIn">Divine Seva & Worship Portal</p>
            <div className="flex justify-center gap-4 mt-8">
              <a href="#about" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105">
                Learn More
              </a>
            </div>
          </div>
        </section>
      )}

      {/* About Section - FIRST */}
      <section 
        id="about" 
        className={`scroll-section relative py-20 px-4 overflow-hidden transition-all duration-1000 ${
          visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={sectionBackgrounds.aboutBg ? {
          backgroundImage: `url('${sectionBackgrounds.aboutBg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        } : undefined}
      >
        {sectionBackgrounds.aboutBg && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60"></div>
        )}
        {!sectionBackgrounds.aboutBg && (
          <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-white"></div>
        )}
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-5xl font-serif font-bold mb-4 ${sectionBackgrounds.aboutBg ? 'text-white' : 'text-amber-900'}`}>
              Welcome to Our Sacred Temple
            </h2>
            <div className={`w-24 h-1 mx-auto ${sectionBackgrounds.aboutBg ? 'bg-white' : 'bg-orange-500'}`}></div>
          </div>

          <div className={`rounded-2xl shadow-2xl p-12 mb-12 ${sectionBackgrounds.aboutBg ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'}`}>
            <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap text-center max-w-4xl mx-auto">
              {about.content}
            </p>
          </div>

          {/* Carousel for Temple Boxes */}
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentBoxIndex * 100}%)` }}
              >
                {/* Box 1 */}
                <div className="w-full flex-shrink-0 px-4">
                  <div className={`p-12 rounded-xl shadow-2xl transition-all duration-300 border-t-4 border-orange-500 max-w-2xl mx-auto ${sectionBackgrounds.aboutBg ? 'bg-white/95 backdrop-blur-sm' : 'bg-gradient-to-br from-orange-100 to-yellow-100'}`}>
                    <div className="text-center">
                      <div className="text-7xl mb-6">🕉️</div>
                      <h3 className="text-3xl font-bold text-amber-900 mb-6">{templeBoxes.box1Title}</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{templeBoxes.box1Content}</p>
                    </div>
                  </div>
                </div>

                {/* Box 2 */}
                <div className="w-full flex-shrink-0 px-4">
                  <div className={`p-12 rounded-xl shadow-2xl transition-all duration-300 border-t-4 border-orange-500 max-w-2xl mx-auto ${sectionBackgrounds.aboutBg ? 'bg-white/95 backdrop-blur-sm' : 'bg-gradient-to-br from-orange-100 to-yellow-100'}`}>
                    <div className="text-center">
                      <div className="text-7xl mb-6">🙏</div>
                      <h3 className="text-3xl font-bold text-amber-900 mb-6">{templeBoxes.box2Title}</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{templeBoxes.box2Content}</p>
                    </div>
                  </div>
                </div>

                {/* Box 3 */}
                <div className="w-full flex-shrink-0 px-4">
                  <div className={`p-12 rounded-xl shadow-2xl transition-all duration-300 border-t-4 border-orange-500 max-w-2xl mx-auto ${sectionBackgrounds.aboutBg ? 'bg-white/95 backdrop-blur-sm' : 'bg-gradient-to-br from-orange-100 to-yellow-100'}`}>
                    <div className="text-center">
                      <div className="text-7xl mb-6">✨</div>
                      <h3 className="text-3xl font-bold text-amber-900 mb-6">{templeBoxes.box3Title}</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{templeBoxes.box3Content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBoxIndex(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === currentBoxIndex
                      ? `${sectionBackgrounds.aboutBg ? 'bg-white' : 'bg-orange-600'} w-8`
                      : `${sectionBackgrounds.aboutBg ? 'bg-white/50' : 'bg-orange-300'} w-3 hover:${sectionBackgrounds.aboutBg ? 'bg-white/75' : 'bg-orange-400'}`
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Temple Timings Section */}
      <section 
        id="timings" 
        className={`scroll-section relative py-20 px-4 overflow-hidden transition-all duration-1000 ${
          visibleSections.has('timings') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={sectionBackgrounds.timingsBg ? {
          backgroundImage: `url('${sectionBackgrounds.timingsBg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        } : undefined}
      >
        {sectionBackgrounds.timingsBg && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        )}
        {!sectionBackgrounds.timingsBg && (
          <div className="absolute inset-0 bg-white"></div>
        )}
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-5xl font-serif font-bold mb-4 ${sectionBackgrounds.timingsBg ? 'text-white' : 'text-amber-900'}`}>Temple Timings</h2>
            <div className={`w-24 h-1 mx-auto mb-4 ${sectionBackgrounds.timingsBg ? 'bg-white' : 'bg-orange-500'}`}></div>
            <p className={`text-lg ${sectionBackgrounds.timingsBg ? 'text-white/90' : 'text-gray-600'}`}>Visit us during these sacred hours</p>
          </div>

          <div className={`p-12 rounded-2xl shadow-xl border-l-8 ${sectionBackgrounds.timingsBg ? 'bg-white/95 backdrop-blur-sm border-white' : 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-500'}`}>
            <p className="text-2xl text-gray-800 leading-relaxed whitespace-pre-line font-medium text-center">
              {timings.content}
            </p>
          </div>
        </div>
      </section>

      {/* Sevas Section */}
      <section 
        id="sevas" 
        className={`scroll-section relative py-20 px-4 overflow-hidden transition-all duration-1000 ${
          visibleSections.has('sevas') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={sectionBackgrounds.sevasBg ? {
          backgroundImage: `url('${sectionBackgrounds.sevasBg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        } : undefined}
      >
        {sectionBackgrounds.sevasBg && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        )}
        {!sectionBackgrounds.sevasBg && (
          <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-white"></div>
        )}
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-5xl font-serif font-bold mb-4 ${sectionBackgrounds.sevasBg ? 'text-white' : 'text-amber-900'}`}>Sevas & Offerings</h2>
            <div className={`w-24 h-1 mx-auto mb-4 ${sectionBackgrounds.sevasBg ? 'bg-white' : 'bg-orange-500'}`}></div>
            <p className={`text-lg mb-6 ${sectionBackgrounds.sevasBg ? 'text-white/90' : 'text-gray-600'}`}>{sevaSection.description}</p>
            <small className={sectionBackgrounds.sevasBg ? 'text-white/80' : 'text-gray-500'}>* Prices are subject to change. Please confirm at the temple office.</small>
          </div>

          {sevaSection.sevas.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
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
                <a href="/donate" className="inline-block bg-white text-orange-700 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                  Book a Seva Online
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
              <div className="text-7xl mb-6">🙏</div>
              <p className="text-2xl text-gray-600 font-serif">Seva details coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section 
        className={`relative py-24 px-4 overflow-hidden ${
          !sectionBackgrounds.galleryBg ? 'bg-gradient-to-br from-orange-50 via-white to-yellow-50' : ''
        }`}
        style={sectionBackgrounds.galleryBg ? {
          backgroundImage: `url(${sectionBackgrounds.galleryBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        } : undefined}
      >
        {sectionBackgrounds.galleryBg && (
          <div className="absolute inset-0 bg-black/60"></div>
        )}
        {!sectionBackgrounds.galleryBg && (
          <>
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className={`text-6xl font-serif font-bold mb-3 ${
                sectionBackgrounds.galleryBg 
                  ? 'text-white' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600'
              }`}>
                Temple Gallery
              </h2>
              <p className={`text-xl ${sectionBackgrounds.galleryBg ? 'text-white/90' : 'text-gray-600'}`}>
                Witness divine moments and sacred celebrations
              </p>
            </div>
            <a 
              href="/gallery" 
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All <span className="text-2xl">→</span>
            </a>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
              {photos.length > 0 ? (
                photos.slice(0, 8).map((photo, index) => (
                  <a
                    key={photo.id}
                    href="/gallery"
                    className="flex-shrink-0 w-80 snap-start group cursor-pointer"
                  >
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-white hover:border-orange-300">
                      <img
                        src={photo.imageData}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-white font-semibold text-lg line-clamp-2">{photo.caption}</p>
                      </div>
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="flex-shrink-0 w-80 snap-start">
                  <div className="h-96 rounded-2xl bg-gradient-to-br from-orange-200 to-yellow-300 flex items-center justify-center shadow-xl">
                    <div className="text-center">
                      <div className="text-8xl mb-4">📸</div>
                      <p className="text-xl font-serif font-bold text-amber-900">Coming Soon</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center mt-6 md:hidden">
              <a href="/gallery" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg">
                View All Gallery <span className="text-2xl">→</span>
              </a>
            </div>
            <p className={`text-center mt-4 text-sm flex items-center justify-center gap-2 ${
              sectionBackgrounds.galleryBg ? 'text-white/70' : 'text-gray-400'
            }`}>
              <span>Swipe to see more</span>
              <span className="animate-pulse">→</span>
            </p>
          </div>
        </div>
      </section>

      {/* Books Preview Section */}
      <section 
        className={`relative py-24 px-4 overflow-hidden ${
          !sectionBackgrounds.booksBg ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-white' : ''
        }`}
        style={sectionBackgrounds.booksBg ? {
          backgroundImage: `url(${sectionBackgrounds.booksBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        } : undefined}
      >
        {sectionBackgrounds.booksBg && (
          <div className="absolute inset-0 bg-black/60"></div>
        )}
        {!sectionBackgrounds.booksBg && (
          <>
            <div className="absolute top-1/2 left-0 w-80 h-80 bg-amber-300 rounded-full filter blur-3xl opacity-20 -translate-x-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className={`text-6xl font-serif font-bold mb-3 ${
                sectionBackgrounds.booksBg 
                  ? 'text-white' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600'
              }`}>
                Sacred Literature
              </h2>
              <p className={`text-xl ${sectionBackgrounds.booksBg ? 'text-white/90' : 'text-gray-600'}`}>
                Explore spiritual wisdom and ancient texts
              </p>
            </div>
            <a 
              href="/books" 
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All <span className="text-2xl">→</span>
            </a>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
              {books.length > 0 ? (
                books.slice(0, 8).map((book, index) => (
                  <a
                    key={book.id}
                    href="/books"
                    className="flex-shrink-0 w-72 snap-start group cursor-pointer"
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-white border-4 border-amber-100 hover:border-amber-300">
                      <div className="relative h-96 bg-gradient-to-br from-yellow-100 to-orange-100 overflow-hidden">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.fileName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500">
                            <div className="text-8xl">📖</div>
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
                ))
              ) : (
                <div className="flex-shrink-0 w-72 snap-start">
                  <div className="h-[500px] rounded-2xl bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center shadow-xl">
                    <div className="text-center">
                      <div className="text-8xl mb-4">📚</div>
                      <p className="text-xl font-serif font-bold text-amber-900">Coming Soon</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center mt-6 md:hidden">
              <a href="/books" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg">
                View All Books <span className="text-2xl">→</span>
              </a>
            </div>
            <p className={`text-center mt-4 text-sm flex items-center justify-center gap-2 ${
              sectionBackgrounds.booksBg ? 'text-white/70' : 'text-gray-400'
            }`}>
              <span>Swipe to see more</span>
              <span className="animate-pulse">→</span>
            </p>
          </div>
        </div>
      </section>

      {/* Songs Preview Section */}
      <section 
        className={`relative py-24 px-4 overflow-hidden ${
          !sectionBackgrounds.songsBg ? 'bg-gradient-to-br from-pink-50 via-orange-50 to-white' : ''
        }`}
        style={sectionBackgrounds.songsBg ? {
          backgroundImage: `url(${sectionBackgrounds.songsBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        } : undefined}
      >
        {sectionBackgrounds.songsBg && (
          <div className="absolute inset-0 bg-black/60"></div>
        )}
        {!sectionBackgrounds.songsBg && (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
          </>
        )}
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className={`text-6xl font-serif font-bold mb-3 ${
                sectionBackgrounds.songsBg 
                  ? 'text-white' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600'
              }`}>
                Devotional Music
              </h2>
              <p className={`text-xl ${sectionBackgrounds.songsBg ? 'text-white/90' : 'text-gray-600'}`}>
                Listen to sacred bhajans and spiritual chants
              </p>
            </div>
            <a 
              href="/songs" 
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-pink-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All <span className="text-2xl">→</span>
            </a>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
              {songs.length > 0 ? (
                songs.slice(0, 8).map((song, index) => (
                  <a
                    key={song.id}
                    href="/songs"
                    className="flex-shrink-0 w-80 snap-start group cursor-pointer"
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-pink-100 to-orange-100 border-4 border-white hover:border-pink-200">
                      <div className="relative h-64 overflow-hidden">
                        {song.coverImage ? (
                          <img
                            src={song.coverImage}
                            alt={song.fileName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-orange-500">
                            <div className="text-8xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">🎵</div>
                          </div>
                        )}
                      </div>
                      <div className="p-6 bg-white">
                        <h3 className="font-serif font-bold text-amber-900 text-lg mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-orange-700 transition-colors">
                          {song.fileName}
                        </h3>
                        <audio
                          controls
                          className="w-full rounded-lg h-10 accent-pink-600 mb-3"
                          controlsList="nodownload"
                        >
                          <source src={song.fileData} type="audio/mpeg" />
                        </audio>
                        <div className="bg-gradient-to-r from-pink-500 to-orange-600 text-white text-center px-4 py-3 rounded-full font-bold group-hover:from-pink-600 group-hover:to-orange-700 transition-all shadow-md hover:shadow-lg">
                          Download Song
                        </div>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="flex-shrink-0 w-80 snap-start">
                  <div className="h-[480px] rounded-2xl bg-gradient-to-br from-pink-200 to-orange-300 flex items-center justify-center shadow-xl">
                    <div className="text-center">
                      <div className="text-8xl mb-4">🎶</div>
                      <p className="text-xl font-serif font-bold text-amber-900">Coming Soon</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center mt-6 md:hidden">
              <a href="/songs" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-pink-600 hover:to-orange-700 transition-all shadow-lg">
                View All Songs <span className="text-2xl">→</span>
              </a>
            </div>
            <p className={`text-center mt-4 text-sm flex items-center justify-center gap-2 ${
              sectionBackgrounds.songsBg ? 'text-white/70' : 'text-gray-400'
            }`}>
              <span>Swipe to see more</span>
              <span className="animate-pulse">→</span>
            </p>
          </div>
        </div>
      </section>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedPhoto(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-5xl w-full transform transition-all duration-300 scale-100" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img
                src={selectedPhoto.imageData}
                alt={selectedPhoto.caption}
                className="w-full h-auto max-h-[70vh] object-contain bg-gray-100"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all text-xl font-bold shadow-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6 bg-gradient-to-b from-orange-50 to-yellow-50">
              <p className="text-gray-800 mb-3 font-medium text-lg">{selectedPhoto.caption}</p>
              <p className="text-sm text-orange-600 font-semibold">Uploaded: {selectedPhoto.uploadedAt}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section 
        id="contact" 
        className={`scroll-section py-20 px-4 bg-gradient-to-b from-orange-600 to-amber-700 text-white transition-all duration-1000 ${
          visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-serif font-bold mb-4">Visit Us</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
            <p className="text-xl text-white/90">Connect with our sacred temple</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-2xl font-serif font-bold mb-3">Email</h3>
              <a 
                href={`mailto:${contactInfo.email}`}
                className="text-yellow-200 hover:text-yellow-100 break-all font-medium text-lg transition-colors"
              >
                {contactInfo.email}
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-2xl font-serif font-bold mb-3">Phone</h3>
              <a 
                href={`tel:${contactInfo.phone}`}
                className="text-yellow-200 hover:text-yellow-100 font-medium text-lg transition-colors"
              >
                {contactInfo.phone}
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-2xl font-serif font-bold mb-3">Address</h3>
              <p className="text-white/90 font-medium">{contactInfo.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-3xl font-serif font-bold text-white mb-4">Shri Sadguru Pundalingeshwar Temple</h3>
            <p className="text-lg mb-2">{contactInfo.address}</p>
            <p className="text-lg mb-6">{contactInfo.phone}</p>
            <div className="w-24 h-0.5 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-sm text-gray-400">© 2025 Shri Pundalingeshwar Temple. Devotion is the path to Divinity.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

