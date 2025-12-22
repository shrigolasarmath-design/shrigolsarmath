'use client';

import { useContent } from '@/context/ContentContext';
import { useState } from 'react';
import AdminProtected from '@/components/AdminProtected';

export default function BannerSettingsPage() {
  const { bannerSettings, updateBannerLogo } = useContent();
  const [uploading, setUploading] = useState(false);

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

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateBannerLogo(base64String);
      setUploading(false);
    };
    reader.onerror = () => {
      alert('Failed to upload image');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    if (confirm('Are you sure you want to remove the banner logo?')) {
      updateBannerLogo('');
    }
  };

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-amber-900 mb-2">Banner Settings</h1>
              <p className="text-gray-600">Upload a logo to display on the navigation banner</p>
            </div>

            <div className="space-y-6">
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
                    <p className="text-sm text-gray-400 mt-2">The temple name will be displayed as text</p>
                  </div>
                )}
              </div>

              {/* Upload New Logo */}
              <div className="border-2 border-gray-300 rounded-lg p-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Upload New Logo</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">📋 Upload Guidelines:</h3>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Recommended size: 200x200 pixels or similar square/rectangular ratio</li>
                      <li>Supported formats: PNG, JPG, JPEG, GIF, SVG</li>
                      <li>Maximum file size: 2MB</li>
                      <li>Use transparent background (PNG) for best results</li>
                      <li>Logo will be displayed at 48px height</li>
                    </ul>
                  </div>

                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-orange-500 file:to-orange-600 file:text-white hover:file:from-orange-600 hover:file:to-orange-700 file:cursor-pointer cursor-pointer"
                    />
                  </label>

                  {uploading && (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                      <p className="text-gray-600 mt-2">Uploading logo...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="font-semibold text-amber-900 mb-3">💡 Design Tips:</h3>
                <ul className="text-sm text-amber-800 space-y-2">
                  <li>• Use a simple, recognizable design that represents your temple</li>
                  <li>• Ensure the logo is clearly visible on a dark amber background</li>
                  <li>• Consider using your temple's deity symbol or traditional motifs</li>
                  <li>• Test how the logo looks on both desktop and mobile devices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtected>
  );
}
