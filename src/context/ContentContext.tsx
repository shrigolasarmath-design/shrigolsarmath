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

export interface Timing {
  id: string;
  day: string;
  opening: string;
  closing: string;
}

export interface TimingsSection {
  description: string;
  timings: Timing[];
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
  coverImage: string; // base64 cover image
  uploadedAt: string;
}

export interface Song {
  id: string;
  fileData: string; // base64 file data
  fileName: string;
  coverImage: string; // base64 cover image
  uploadedAt: string;
}

export interface HeroPhoto {
  id: string;
  imageData: string; // base64 image data
  uploadedAt: string;
}

export interface SectionBackgrounds {
  aboutBg: string;
  timingsBg: string;
  sevasBg: string;
  galleryBg: string;
  booksBg: string;
  songsBg: string;
}

export interface PageBackgrounds {
  aboutPage: string;
  timingsPage: string;
  sevasPage: string;
  galleryPage: string;
  booksPage: string;
  songsPage: string;
}

export interface BannerSettings {
  logo: string; // base64 image data for banner logo
  image: string; // base64 image data for banner background
  text: string; // banner text
}

interface ContentContextType {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  deletePhoto: (id: string) => void;
  heroPhotos: HeroPhoto[];
  addHeroPhoto: (photo: HeroPhoto) => void;
  deleteHeroPhoto: (id: string) => void;
  sectionBackgrounds: SectionBackgrounds;
  updateSectionBackground: (section: keyof SectionBackgrounds, imageData: string) => void;
  pageBackgrounds: PageBackgrounds;
  updatePageBackground: (page: keyof PageBackgrounds, imageData: string) => void;
  bannerSettings: BannerSettings;
  updateBannerLogo: (imageData: string) => void;
  updateBannerImage: (imageData: string) => void;
  updateBannerText: (text: string) => void;
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
  timingsSection: TimingsSection;
  updateTimingsSection: (section: TimingsSection) => void;
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

const defaultTimingsSection: TimingsSection = {
  description: 'Plan your visit to the temple',
  timings: [],
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

const defaultSectionBackgrounds: SectionBackgrounds = {
  aboutBg: '',
  timingsBg: '',
  sevasBg: '',
  galleryBg: '',
  booksBg: '',
  songsBg: '',
};

const defaultPageBackgrounds: PageBackgrounds = {
  aboutPage: '',
  timingsPage: '',
  sevasPage: '',
  galleryPage: '',
  booksPage: '',
  songsPage: '',
};

const defaultBannerSettings: BannerSettings = {
  logo: '',
  image: '',
  text: '',
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [heroPhotos, setHeroPhotos] = useState<HeroPhoto[]>([]);
  const [sectionBackgrounds, setSectionBackgrounds] = useState<SectionBackgrounds>(defaultSectionBackgrounds);
  const [pageBackgrounds, setPageBackgrounds] = useState<PageBackgrounds>(defaultPageBackgrounds);
  const [bannerSettings, setBannerSettings] = useState<BannerSettings>({ logo: '', image: '', text: '' });
  const [books, setBooks] = useState<Book[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [templeHistory, setTempleHistory] = useState<TempleHistory>(defaultTempleHistory);
  const [about, setAbout] = useState<About>(defaultAbout);
  const [timings, setTimings] = useState<Timings>(defaultTimings);
  const [timingsSection, setTimingsSection] = useState<TimingsSection>(defaultTimingsSection);
  const [sevaSection, setSevaSection] = useState<SevaSection>(defaultSevaSection);
  const [templeBoxes, setTempleBoxes] = useState<TempleBoxes>(defaultTempleBoxes);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from server on mount
  const updateBannerImage = (imageData: string) => {
    setBannerSettings((prev) => ({ ...prev, image: imageData }));
  };
  const updateBannerText = (text: string) => {
    setBannerSettings((prev) => ({ ...prev, text }));
  };
  useEffect(() => {
    const loadData = async () => {
      // Load photos from server
      try {
        const response = await fetch('/api/photos');
        if (response.ok) {
          const serverPhotos = await response.json();
          console.log('Fetched photos from API:', serverPhotos);
          // Convert server response to Photo format
          const photosData = serverPhotos.map((p: any) => ({
            id: p.id,
            imageData: p.imageUrl || p.imageData, // imageUrl is the file path returned from our API
            caption: p.caption || 'Untitled',
            uploadedAt: p.uploadedAt || new Date().toLocaleDateString(),
          }));
          console.log('Processed photos:', photosData);
          setPhotos(photosData);
        } else {
          console.error('Failed to fetch photos:', response.status, await response.text());
        }
      } catch (error) {
        console.error('Failed to load photos from server:', error);
      }

      // Load all other content from server
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const content = await response.json();
          
          if (content.heroPhotos) setHeroPhotos(content.heroPhotos);
          if (content.sectionBackgrounds) setSectionBackgrounds(content.sectionBackgrounds);
          if (content.pageBackgrounds) setPageBackgrounds(content.pageBackgrounds);
          if (content.bannerSettings) setBannerSettings(content.bannerSettings);
          if (content.books) setBooks(content.books);
          if (content.songs) setSongs(content.songs);
          if (content.contactInfo) setContactInfo(content.contactInfo);
          if (content.templeHistory) setTempleHistory(content.templeHistory);
          if (content.about) setAbout(content.about);
          if (content.timings) setTimings(content.timings);
          if (content.timingsSection) setTimingsSection(content.timingsSection);
          if (content.sevaSection) setSevaSection(content.sevaSection);
          if (content.templeBoxes) setTempleBoxes(content.templeBoxes);
        }
      } catch (error) {
        console.error('Failed to load content from server');
      }

      setIsLoaded(true);
    };

    loadData();
  }, []);

  // Save content to server whenever it changes
  const saveToServer = async (updates: any) => {
    if (!isLoaded) return;
    
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error('Failed to save content to server:', error);
    }
  };

  // Save photos to server (managed via photos API)
  useEffect(() => {
    // Photos are managed via /api/photos
  }, [photos, isLoaded]);

  // Save hero photos to server
  useEffect(() => {
    if (isLoaded) {
      saveToServer({ heroPhotos });
    }
  }, [heroPhotos, isLoaded]);

  // Save section backgrounds to server
  useEffect(() => {
    if (isLoaded) {
      saveToServer({ sectionBackgrounds });
    }
  }, [sectionBackgrounds, isLoaded]);

  // Save page backgrounds to server
  useEffect(() => {
    if (isLoaded) {
      saveToServer({ pageBackgrounds });
    }
  }, [pageBackgrounds, isLoaded]);

  // Save banner settings to server
  useEffect(() => {
    if (isLoaded) {
      saveToServer({ bannerSettings });
    }
  }, [bannerSettings, isLoaded]);

  // Save books to server
  useEffect(() => {
    if (isLoaded) {
      saveToServer({ books });
    }
  }, [books, isLoaded]);

  // Save songs to server
  useEffect(() => {
    if (isLoaded) {
      saveToServer({ songs });
    }
  }, [songs, isLoaded]);

  // Save contact info to server
  useEffect(() => {
    if (isLoaded) {
      saveToServer({ contactInfo });
    }
  }, [contactInfo, isLoaded]);

  // Save temple history to server
  useEffect(() => {
    if (isLoaded) {
      saveToServer({ templeHistory });
    }
  }, [templeHistory, isLoaded]);

  // Save about to server
  useEffect(() => {
    if (isLoaded) {
      saveToServer({ about });
    }
  }, [about, isLoaded]);

  // Save timings to server
  useEffect(() => {
    if (isLoaded) {
      saveToServer({ timings });
    }
  }, [timings, isLoaded]);

  // Save timingsSection to server
  useEffect(() => {
    if (isLoaded) {
      saveToServer({ timingsSection });
    }
  }, [timingsSection, isLoaded]);

  // Save seva section to server
  useEffect(() => {
    if (isLoaded) {
      saveToServer({ sevaSection });
    }
  }, [sevaSection, isLoaded]);

  // Save temple boxes to server
  useEffect(() => {
    if (isLoaded) {
      saveToServer({ templeBoxes });
    }
  }, [templeBoxes, isLoaded]);

  const addPhoto = (photo: Photo) => {
    setPhotos((prev) => [photo, ...prev]);
  };

  const deletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    // Delete from server
    fetch('/api/photos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId: id }),
    }).catch(error => console.error('Failed to delete photo from server', error));
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

  const updateTimingsSection = (section: TimingsSection) => {
    setTimingsSection(section);
  };

  const updateSevaSection = (section: SevaSection) => {
    setSevaSection(section);
  };

  const updateTempleBoxes = (boxes: TempleBoxes) => {
    setTempleBoxes(boxes);
  };

  const updateSectionBackground = (section: keyof SectionBackgrounds, imageData: string) => {
    setSectionBackgrounds(prev => ({
      ...prev,
      [section]: imageData
    }));
  };

  const updatePageBackground = (page: keyof PageBackgrounds, imageData: string) => {
    setPageBackgrounds(prev => ({
      ...prev,
      [page]: imageData
    }));
  };

  const updateBannerLogo = (imageData: string) => {
    setBannerSettings(prev => ({
      ...prev,
      logo: imageData
    }));
  };

  return (
    <ContentContext.Provider value={{ photos, addPhoto, deletePhoto, heroPhotos, addHeroPhoto, deleteHeroPhoto, sectionBackgrounds, updateSectionBackground, pageBackgrounds, updatePageBackground, bannerSettings, updateBannerLogo, updateBannerImage, updateBannerText, books, addBook, deleteBook, songs, addSong, deleteSong, contactInfo, updateContactInfo, templeHistory, updateTempleHistory, about, updateAbout, timings, updateTimings, timingsSection, updateTimingsSection, sevaSection, updateSevaSection, templeBoxes, updateTempleBoxes }}>
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
