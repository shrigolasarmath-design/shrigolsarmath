'use client';

import React, { createContext, useState, useEffect } from 'react';

export interface Photo {
  id: string;
  imageData: string; // base64 image data
  caption: string;
  uploadedAt: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  description: string;
}

export interface TempleHistory {
  history: string;
}

export interface About {
  content: string;
}

export interface Timings {
  content: string;
}

export interface Seva {
  id: string;
  name: string;
  frequency: string;
  price: string;
}

export interface SevaSection {
  description: string;
  sevas: Seva[];
}

export interface TempleBoxes {
  box1Title: string;
  box1Content: string;
  box2Title: string;
  box2Content: string;
  box3Title: string;
  box3Content: string;
}

export interface Book {
  id: string;
  fileData: string; // base64 file data
  fileName: string;
  uploadedAt: string;
}

export interface Song {
  id: string;
  fileData: string; // base64 file data
  fileName: string;
  uploadedAt: string;
}

export interface HeroPhoto {
  id: string;
  imageData: string; // base64 image data
  uploadedAt: string;
}

interface ContentContextType {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  deletePhoto: (id: string) => void;
  heroPhotos: HeroPhoto[];
  addHeroPhoto: (photo: HeroPhoto) => void;
  deleteHeroPhoto: (id: string) => void;
  books: Book[];
  addBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  songs: Song[];
  addSong: (song: Song) => void;
  deleteSong: (id: string) => void;
  contactInfo: ContactInfo;
  updateContactInfo: (info: ContactInfo) => void;
  templeHistory: TempleHistory;
  updateTempleHistory: (history: TempleHistory) => void;
  about: About;
  updateAbout: (about: About) => void;
  timings: Timings;
  updateTimings: (timings: Timings) => void;
  sevaSection: SevaSection;
  updateSevaSection: (section: SevaSection) => void;
  templeBoxes: TempleBoxes;
  updateTempleBoxes: (boxes: TempleBoxes) => void;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

const defaultContactInfo: ContactInfo = {
  email: 'contact@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, City, State 12345',
  description: 'Welcome to our website! We are dedicated to providing excellent service.',
};

const defaultTempleHistory: TempleHistory = {
  history: 'Shri Pundalingeshwar Temple has a rich spiritual heritage spanning centuries. This sacred space is dedicated to Lord Shiva and welcomes devotees from all walks of life.',
};

const defaultAbout: About = {
  content: 'We are dedicated to preserving and promoting spiritual traditions while creating a welcoming sanctuary for all devotees seeking divine blessings and inner peace. Faith, devotion, and compassion guide everything we do.',
};

const defaultTimings: Timings = {
  content: 'Morning: 6:00 AM - 12:00 PM\nAfternoon: 4:00 PM - 8:00 PM\nEvening Aarti: 7:00 PM daily',
};

const defaultSevaSection: SevaSection = {
  description: 'Devotees can offer the following sevas to Lord Pundalingeshwara. Receipts will be issued for all contributions.',
  sevas: [
    { id: '1', name: 'Ashtottara Archane', frequency: 'Daily', price: '₹ 51' },
    { id: '2', name: 'Panchamrut Abhishekam', frequency: 'Daily', price: '₹ 251' },
    { id: '3', name: 'Ekadasha Rudrabhishekam', frequency: 'Special Request', price: '₹ 1,100' },
    { id: '4', name: 'Maha Naivedya Seva', frequency: 'Afternoon', price: '₹ 501' },
    { id: '5', name: 'Annadhanam (One Day Meal)', frequency: 'Full Day', price: '₹ 5,001' },
    { id: '6', name: 'Shravana Masa Special Pooja', frequency: 'Monday (Seasonal)', price: '₹ 1,001' },
  ],
};

const defaultTempleBoxes: TempleBoxes = {
  box1Title: '🙏 Our Spiritual Mission',
  box1Content: 'We are dedicated to preserving and promoting spiritual traditions while creating a welcoming sanctuary for all devotees seeking divine blessings and inner peace.',
  box2Title: '✨ Our Sacred Values',
  box2Content: 'Faith, devotion, and compassion guide everything we do. We believe in the power of unity, collective worship, and serving our community with love and respect.',
  box3Title: '🌟 Our Vision',
  box3Content: 'To be a beacon of light and spiritual guidance, inspiring devotion, strengthening community bonds, and creating a world filled with peace and divine blessings.',
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [heroPhotos, setHeroPhotos] = useState<HeroPhoto[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [templeHistory, setTempleHistory] = useState<TempleHistory>(defaultTempleHistory);
  const [about, setAbout] = useState<About>(defaultAbout);
  const [timings, setTimings] = useState<Timings>(defaultTimings);
  const [sevaSection, setSevaSection] = useState<SevaSection>(defaultSevaSection);
  const [templeBoxes, setTempleBoxes] = useState<TempleBoxes>(defaultTempleBoxes);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPhotos = localStorage.getItem('photos');
    const savedHeroPhotos = localStorage.getItem('heroPhotos');
    const savedBooks = localStorage.getItem('books');
    const savedSongs = localStorage.getItem('songs');
    const savedContact = localStorage.getItem('contactInfo');
    const savedHistory = localStorage.getItem('templeHistory');
    const savedAbout = localStorage.getItem('about');
    const savedTimings = localStorage.getItem('timings');
    const savedSevaSection = localStorage.getItem('sevaSection');
    const savedTempleBoxes = localStorage.getItem('templeBoxes');
    
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
    if (savedHeroPhotos) {
      setHeroPhotos(JSON.parse(savedHeroPhotos));
    }
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
    if (savedSongs) {
      setSongs(JSON.parse(savedSongs));
    }
    if (savedContact) {
      setContactInfo(JSON.parse(savedContact));
    }
    if (savedHistory) {
      setTempleHistory(JSON.parse(savedHistory));
    }
    if (savedAbout) {
      setAbout(JSON.parse(savedAbout));
    }
    if (savedTimings) {
      setTimings(JSON.parse(savedTimings));
    }
    if (savedSevaSection) {
      setSevaSection(JSON.parse(savedSevaSection));
    }
    if (savedTempleBoxes) {
      setTempleBoxes(JSON.parse(savedTempleBoxes));
    }
    setIsLoaded(true);
  }, []);

  // Save photos to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('photos', JSON.stringify(photos));
    }
  }, [photos, isLoaded]);

  // Save hero photos to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('heroPhotos', JSON.stringify(heroPhotos));
    }
  }, [heroPhotos, isLoaded]);

  // Save books to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('books', JSON.stringify(books));
    }
  }, [books, isLoaded]);

  // Save songs to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('songs', JSON.stringify(songs));
    }
  }, [songs, isLoaded]);

  // Save contact info to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
    }
  }, [contactInfo, isLoaded]);

  // Save temple history to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('templeHistory', JSON.stringify(templeHistory));
    }
  }, [templeHistory, isLoaded]);

  // Save about to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('about', JSON.stringify(about));
    }
  }, [about, isLoaded]);

  // Save timings to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('timings', JSON.stringify(timings));
    }
  }, [timings, isLoaded]);

  // Save seva section to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('sevaSection', JSON.stringify(sevaSection));
    }
  }, [sevaSection, isLoaded]);

  // Save temple boxes to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('templeBoxes', JSON.stringify(templeBoxes));
    }
  }, [templeBoxes, isLoaded]);

  const addPhoto = (photo: Photo) => {
    setPhotos((prev) => [photo, ...prev]);
  };

  const deletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const addHeroPhoto = (photo: HeroPhoto) => {
    setHeroPhotos((prev) => [photo, ...prev]);
  };

  const deleteHeroPhoto = (id: string) => {
    setHeroPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const addBook = (book: Book) => {
    setBooks((prev) => [book, ...prev]);
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const addSong = (song: Song) => {
    setSongs((prev) => [song, ...prev]);
  };

  const deleteSong = (id: string) => {
    setSongs((prev) => prev.filter((song) => song.id !== id));
  };

  const updateContactInfo = (info: ContactInfo) => {
    setContactInfo(info);
  };

  const updateTempleHistory = (history: TempleHistory) => {
    setTempleHistory(history);
  };

  const updateAbout = (about: About) => {
    setAbout(about);
  };

  const updateTimings = (timings: Timings) => {
    setTimings(timings);
  };

  const updateSevaSection = (section: SevaSection) => {
    setSevaSection(section);
  };

  const updateTempleBoxes = (boxes: TempleBoxes) => {
    setTempleBoxes(boxes);
  };

  return (
    <ContentContext.Provider value={{ photos, addPhoto, deletePhoto, heroPhotos, addHeroPhoto, deleteHeroPhoto, books, addBook, deleteBook, songs, addSong, deleteSong, contactInfo, updateContactInfo, templeHistory, updateTempleHistory, about, updateAbout, timings, updateTimings, sevaSection, updateSevaSection, templeBoxes, updateTempleBoxes }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = React.useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
}
