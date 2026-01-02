'use client';

import { useContent } from '@/context/ContentContext';
import { useState } from 'react';
import { AdminProtected } from '@/components/AdminProtected';

export default function BannerSettingsPage() {
  const { bannerSettings, updateBannerLogo, updateBannerImage, updateBannerText } = useContent();
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [bannerText, setBannerText] = useState(bannerSettings.text || '');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    uploadLogoToSupabase(file);
  };

  const uploadLogoToSupabase = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/uploads?bucket=banner_assets&type=logo`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        alert('Upload failed: ' + error.error);
        setUploading(false);
        return;
      }

      const { fileKey } = await response.json();
      updateBannerLogo(`/api/image?bucket=banner_assets&key=${fileKey}`);
      setUploading(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    if (confirm('Are you sure you want to remove the banner logo?')) {
      updateBannerLogo('');
    }
  };

  // Banner image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    uploadBannerImageToSupabase(file);
  };

  const uploadBannerImageToSupabase = async (file: File) => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/uploads?bucket=banner_assets&type=banner`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        alert('Upload failed: ' + error.error);
        setImageUploading(false);
        return;
      }

      const { fileKey } = await response.json();
      updateBannerImage(`/api/image?bucket=banner_assets&key=${fileKey}`);
      setImageUploading(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
      setImageUploading(false);
    }
  };

  // Banner text update
  const handleTextSave = () => {
    updateBannerText(bannerText);
    alert('Banner text updated!');
  };

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-amber-900 mb-2">Banner Settings</h1>
              <p className="text-gray-600">Upload a logo, banner image, and edit banner text</p>
            </div>
            <div className="space-y-8">
              {/* Current Logo Preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Current Banner Logo</h2>
                {bannerSettings.logo ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-amber-900 to-amber-800 p-6 rounded-lg flex items-center justify-center">
                      <img 
                        src={bannerSettings.logo} 
                        alt="Banner Logo" 
                        className="h-16 w-auto object-contain"
                      />
                    </div>
                    <button
                      onClick={handleRemoveLogo}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                    >
                      Remove Logo
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No logo uploaded yet</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} className="mt-4" />
              </div>
              {/* Banner Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Current Banner Image</h2>
                {bannerSettings.image ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-amber-900 to-amber-800 p-6 rounded-lg flex items-center justify-center">
                      <img 
                        src={bannerSettings.image} 
                        alt="Banner Background" 
                        className="h-32 w-auto object-cover"
                      />
                    </div>
                    <button
                      onClick={() => updateBannerImage('')}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No banner image uploaded yet</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} className="mt-4" />
              </div>
              {/* Banner Text Edit */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Banner Text</h2>
                <textarea
                  className="w-full border rounded p-2"
                  rows={2}
                  value={bannerText}
                  onChange={e => setBannerText(e.target.value)}
                />
                <button className="mt-2 px-4 py-2 bg-amber-600 text-white rounded" onClick={handleTextSave}>Save Text</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtected>
  );
}
