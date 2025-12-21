'use client';

import { useAuth } from '@/context/AuthContext';
import { useContent, Photo } from '@/context/ContentContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ManageGalleryPage() {
  const { isLoggedIn } = useAuth();
  const { photos, addPhoto, deletePhoto } = useContent();
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

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!preview || !caption.trim()) {
      alert('Please select an image and enter a caption');
      return;
    }

    const newPhoto: Photo = {
      id: Date.now().toString(),
      imageData: preview,
      caption: caption.trim(),
      uploadedAt: new Date().toLocaleDateString(),
    };

    addPhoto(newPhoto);
    setPreview(null);
    setCaption('');
    showSuccess('Photo added to gallery successfully!');
  };

  const handleDeletePhoto = (id: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      deletePhoto(id);
      showSuccess('Photo deleted successfully!');
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
          <h1 className="text-4xl font-bold text-amber-900 mb-2">🖼️ Manage Gallery</h1>
          <p className="text-lg text-amber-700">Upload photos with captions for the temple gallery</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 font-semibold">
            ✓ {successMessage}
          </div>
        )}

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
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer block">
                    <div className="text-4xl mb-3">📸</div>
                    <p className="font-bold text-amber-900 text-lg">Drag & Drop Image</p>
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
                Gallery Photos ({photos.length})
              </h2>

              {photos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🖼️</div>
                  <p className="text-xl text-gray-600 font-semibold">No photos yet</p>
                  <p className="text-gray-500">Upload your first photo to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border-2 border-amber-100"
                    >
                      <img
                        src={photo.imageData}
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
      </div>
    </div>
  );
}
