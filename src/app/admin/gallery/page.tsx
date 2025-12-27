'use client';

import { useAuth } from '@/context/AuthContext';
// import { useContent, Photo } from '@/context/ContentContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ManageGalleryPage() {
  const { isLoggedIn } = useAuth();
  // const { photos, addPhoto, deletePhoto } = useContent();
  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [loading, setLoading] = useState(true);
    // Fetch albums.json
    useEffect(() => {
      fetch('/uploads/photos/albums.json')
        .then((res) => res.json())
        .then((data) => {
          setAlbums(data);
          setSelectedAlbum(data[0] || null);
          setLoading(false);
        });
    }, []);
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [caption, setCaption] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push('/login');
    }
  }, [mounted, isLoggedIn, router]);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview || !caption.trim() || !selectedAlbum) {
      alert('Please select an image, enter a caption, and select an album');
      return;
    }
    try {
      // Convert base64 to blob
      const response = await fetch(preview);
      const blob = await response.blob();
      // Create FormData for server upload
      const formData = new FormData();
      formData.append('file', blob, 'photo.jpg');
      formData.append('caption', caption.trim());
      formData.append('albumId', selectedAlbum.id);
      // Upload to server (should update albums.json and upload file)
      // This is a placeholder, you need to update your API to handle albums
      // For now, just update local state for demo
      const newPhoto = {
        id: Date.now().toString(),
        caption: caption.trim(),
        fileExt: 'jpg',
        uploadedAt: new Date().toLocaleDateString(),
      };
      const updatedAlbums = albums.map((album) =>
        album.id === selectedAlbum.id
          ? { ...album, photos: [newPhoto, ...album.photos] }
          : album
      );
      setAlbums(updatedAlbums);
      setSelectedAlbum({ ...selectedAlbum, photos: [newPhoto, ...selectedAlbum.photos] });
      setPreview(null);
      setCaption('');
      showSuccess('Photo added to album successfully!');
      // TODO: Save updatedAlbums to server (albums.json)
    } catch (error) {
      alert('Failed to upload photo. Please try again.');
      console.error('Upload error:', error);
    }
  };

  const handleDeletePhoto = (id: string) => {
    if (!selectedAlbum) return;
    if (confirm('Are you sure you want to delete this photo?')) {
      const updatedAlbums = albums.map((album) =>
        album.id === selectedAlbum.id
          ? { ...album, photos: album.photos.filter((p: any) => p.id !== id) }
          : album
      );
      setAlbums(updatedAlbums);
      setSelectedAlbum({ ...selectedAlbum, photos: selectedAlbum.photos.filter((p: any) => p.id !== id) });
      showSuccess('Photo deleted successfully!');
      // TODO: Save updatedAlbums to server (albums.json)
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-amber-900 mb-2">🖼️ Manage Gallery Albums</h1>
          <p className="text-lg text-amber-700">Add albums and upload photos to specific albums</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 font-semibold">
            ✓ {successMessage}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-xl text-gray-600">Loading albums...</div>
        ) : albums.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-16 text-center border-t-4 border-yellow-600 animate-slideIn">
            <p className="text-xl text-gray-600 mb-4 font-serif">
              No albums found. Please add an album below!
            </p>
          </div>
        ) : (
          <>
            {/* Album Selector and Add Album */}
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              {albums.map((album) => (
                <div key={album.id} className="flex items-center gap-2">
                  {selectedAlbum?.id === album.id && selectedAlbum.editing ? (
                    <>
                      <input
                        type="text"
                        value={selectedAlbum.name}
                        onChange={e => {
                          setSelectedAlbum({ ...selectedAlbum, name: e.target.value });
                          setAlbums(albums.map(a => a.id === album.id ? { ...a, name: e.target.value } : a));
                        }}
                        className="px-2 py-1 border rounded"
                        autoFocus
                        onBlur={() => {
                          setSelectedAlbum({ ...selectedAlbum, editing: false });
                          showSuccess('Album name updated!');
                          // TODO: Save albums to server (albums.json)
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            setSelectedAlbum({ ...selectedAlbum, editing: false });
                            showSuccess('Album name updated!');
                            // TODO: Save albums to server (albums.json)
                          }
                        }}
                      />
                    </>
                  ) : (
                    <button
                      onClick={() => setSelectedAlbum(album)}
                      className={`px-6 py-2 rounded-full font-bold border-2 transition-all text-lg shadow-sm ${selectedAlbum?.id === album.id ? 'bg-orange-400 text-white border-orange-500' : 'bg-white text-amber-900 border-amber-300 hover:bg-orange-100'}`}
                    >
                      {album.name}
                    </button>
                  )}
                  <button
                    title="Edit album name"
                    className="text-amber-700 hover:text-orange-600 px-2"
                    onClick={() => setSelectedAlbum({ ...album, editing: true })}
                  >✏️</button>
                  <button
                    title="Delete album"
                    className="text-red-600 hover:text-red-800 px-2"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this album and all its photos?')) {
                        const updatedAlbums = albums.filter(a => a.id !== album.id);
                        setAlbums(updatedAlbums);
                        if (selectedAlbum?.id === album.id) setSelectedAlbum(updatedAlbums[0] || null);
                        showSuccess('Album deleted!');
                        // TODO: Save albums to server (albums.json)
                      }
                    }}
                  >🗑️</button>
                </div>
              ))}
            </div>
            <div className="flex justify-center mb-8">
              <input
                type="text"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                placeholder="New album name"
                className="px-4 py-2 border-2 border-amber-300 rounded-l-lg focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <button
                onClick={() => {
                  if (!newAlbumName.trim()) return;
                  const newAlbum = { id: Date.now().toString(), name: newAlbumName.trim(), photos: [] };
                  setAlbums([newAlbum, ...albums]);
                  setSelectedAlbum(newAlbum);
                  setNewAlbumName('');
                  showSuccess('Album created!');
                  // TODO: Save albums to server (albums.json)
                }}
                className="px-6 py-2 bg-orange-500 text-white font-bold rounded-r-lg hover:bg-orange-600 transition-all"
              >
                Add Album
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                  <h2 className="text-2xl font-bold text-amber-900 mb-6">Upload Photo</h2>
                  <form onSubmit={handleUploadPhoto} className="space-y-6">
                    {/* Drag and Drop Area */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-4 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                        isDragging
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-amber-300 bg-amber-50 hover:border-amber-400'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileInputChange}
                        className="hidden"
                        id="file-input"
                      />
                      <label htmlFor="file-input" className="cursor-pointer block">
                        <div className="text-4xl mb-3">📸</div>
                        <p className="font-bold text-amber-900 text-lg">Drag & Drop Image (JPG, PNG, WebP)</p>
                        <p className="text-sm text-amber-700 mt-2">or click to select</p>
                      </label>
                    </div>
                    {/* Preview */}
                    {preview && (
                      <div className="relative">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border-2 border-amber-200"
                        />
                        <button
                          type="button"
                          onClick={() => setPreview(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded font-bold hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {/* Caption */}
                    <div>
                      <label className="block text-lg font-semibold text-amber-900 mb-2">
                        Photo Caption
                      </label>
                      <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Enter a caption for this photo..."
                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none font-medium text-gray-800"
                        rows={3}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-bold text-lg shadow-md hover:shadow-lg"
                    >
                      Upload Photo
                    </button>
                  </form>
                </div>
              </div>
              {/* Gallery Display */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-amber-900 mb-6">
                    {selectedAlbum ? `${selectedAlbum.name} Photos (${selectedAlbum.photos.length})` : 'Select an album'}
                  </h2>
                  {selectedAlbum && selectedAlbum.photos.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">🖼️</div>
                      <p className="text-xl text-gray-600 font-semibold">No photos yet</p>
                      <p className="text-gray-500">Upload your first photo to get started!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedAlbum && selectedAlbum.photos.map((photo: any) => (
                        <div
                          key={photo.id}
                          className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border-2 border-amber-100"
                        >
                          <img
                            src={`/uploads/photos/${photo.id}.${photo.fileExt || 'jpg'}`}
                            alt={photo.caption}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4 bg-amber-50">
                            <p className="font-semibold text-gray-800 mb-2">{photo.caption}</p>
                            <p className="text-xs text-gray-600 mb-3">Uploaded: {photo.uploadedAt}</p>
                            <button
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="w-full bg-red-500 text-white py-2 rounded font-bold hover:bg-red-600 transition-colors"
                            >
                              Delete Photo
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
