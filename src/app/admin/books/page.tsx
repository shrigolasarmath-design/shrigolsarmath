'use client';

import { useContent } from '@/context/ContentContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ManageBooksPage() {
  const { books, addBook, deleteBook } = useContent();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push('/login');
    }
  }, [mounted, isLoggedIn, router]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const processFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      // Accept PDF and other document types
      if (file.type === 'application/pdf' || file.type.startsWith('text/') || file.type.includes('document') || file.type.includes('word')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileData = e.target?.result as string;
          const newBook = {
            id: Date.now().toString(),
            fileData: fileData,
            fileName: file.name,
            uploadedAt: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          };
          addBook(newBook);
        };
        reader.readAsDataURL(file);
      } else {
        alert(`${file.name} is not a supported document format. Please upload PDF or document files.`);
      }
    });
  };

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <nav className="bg-gradient-to-r from-amber-900 to-orange-800 text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">🏛️ Shri Sadhguru Pundalingeshwar Temple</h1>
          <button
            onClick={() => router.push('/admin')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded transition"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-10 border-l-4 border-orange-600">
          <h2 className="text-4xl font-bold mb-2 text-amber-900">📚 Manage Temple Books</h2>
          <p className="text-gray-700 mb-8 text-lg">Upload sacred texts, scriptures, and other books</p>

          {/* Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-4 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-orange-600 bg-orange-50 scale-105'
                : 'border-orange-300 bg-orange-50 hover:border-orange-500'
            }`}
          >
            <div className="text-6xl mb-4">📄</div>
            <p className="text-xl font-bold text-amber-900 mb-2">Drag & drop your book files here</p>
            <p className="text-gray-700 mb-4">or</p>
            <label className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition cursor-pointer">
              Browse Files
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                accept=".pdf,.doc,.docx,.txt,.epub"
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-600 mt-4">Supported formats: PDF, DOC, DOCX, TXT, EPUB</p>
          </div>

          {/* Books List */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-amber-900 mb-6 border-b-2 border-orange-400 pb-3">
              Uploaded Books ({books.length})
            </h3>

            {books.length === 0 ? (
              <div className="text-center py-12 bg-orange-50 rounded-lg">
                <p className="text-gray-600 text-lg">No books uploaded yet. Upload some books to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg shadow-md border-l-4 border-orange-500 hover:shadow-lg transition"
                  >
                    <div className="text-5xl mb-3">📕</div>
                    <h4 className="font-bold text-amber-900 text-lg mb-2 break-words line-clamp-2">{book.fileName}</h4>
                    <p className="text-sm text-orange-600 font-semibold mb-4">📅 {book.uploadedAt}</p>
                    <button
                      onClick={() => deleteBook(book.id)}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
