'use client';

import { useAuth } from '@/context/AuthContext';
import { useContent, Seva } from '@/context/ContentContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ManageSevasPage() {
  const { isLoggedIn } = useAuth();
  const { sevaSection, updateSevaSection } = useContent();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [description, setDescription] = useState('');
  const [sevas, setSevas] = useState<Seva[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Seva | null>(null);
  const [newSeva, setNewSeva] = useState({ name: '', frequency: '', price: '' });

  useEffect(() => {
    setMounted(true);
    setDescription(sevaSection.description);
    setSevas(sevaSection.sevas);
  }, [sevaSection]);

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

  const handleSaveDescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please enter the description');
      return;
    }
    updateSevaSection({ description, sevas });
    showSuccess('Description updated successfully!');
  };

  const handleAddSeva = () => {
    if (!newSeva.name.trim() || !newSeva.frequency.trim() || !newSeva.price.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const seva: Seva = {
      id: Date.now().toString(),
      name: newSeva.name,
      frequency: newSeva.frequency,
      price: newSeva.price,
    };

    const updatedSevas = [...sevas, seva];
    setSevas(updatedSevas);
    updateSevaSection({ description, sevas: updatedSevas });
    setNewSeva({ name: '', frequency: '', price: '' });
    showSuccess('Seva added successfully!');
  };

  const handleDeleteSeva = (id: string) => {
    if (confirm('Are you sure you want to delete this seva?')) {
      const updatedSevas = sevas.filter((seva) => seva.id !== id);
      setSevas(updatedSevas);
      updateSevaSection({ description, sevas: updatedSevas });
      showSuccess('Seva deleted successfully!');
    }
  };

  const handleEditSeva = (seva: Seva) => {
    setEditingId(seva.id);
    setEditingData({ ...seva });
  };

  const handleSaveEdit = () => {
    if (!editingData || !editingData.name.trim() || !editingData.frequency.trim() || !editingData.price.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const updatedSevas = sevas.map((seva) => (seva.id === editingId ? editingData : seva));
    setSevas(updatedSevas);
    updateSevaSection({ description, sevas: updatedSevas });
    setEditingId(null);
    setEditingData(null);
    showSuccess('Seva updated successfully!');
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
          <h1 className="text-4xl font-bold text-amber-900 mb-2">🙏 Manage Sevas</h1>
          <p className="text-lg text-amber-700">Add, edit, or remove Sevas and offerings</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 font-semibold">
            ✓ {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description and Add New Seva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">Update Section</h2>

              {/* Update Description */}
              <form onSubmit={handleSaveDescription} className="space-y-4 mb-8 pb-8 border-b-2 border-amber-200">
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-2">
                    Section Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                    rows={4}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 font-bold"
                >
                  Update Description
                </button>
              </form>

              {/* Add New Seva */}
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-4">Add New Seva</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Seva Name"
                    value={newSeva.name}
                    onChange={(e) => setNewSeva({ ...newSeva, name: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Frequency (e.g., Daily)"
                    value={newSeva.frequency}
                    onChange={(e) => setNewSeva({ ...newSeva, frequency: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Price (e.g., ₹ 51)"
                    value={newSeva.price}
                    onChange={(e) => setNewSeva({ ...newSeva, price: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddSeva}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 font-bold"
                  >
                    Add Seva
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sevas List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">Sevas List ({sevas.length})</h2>

              {sevas.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 font-semibold">No sevas added yet</p>
                  <p className="text-gray-500">Add your first seva using the form on the left</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sevas.map((seva) => (
                    <div key={seva.id} className="border-2 border-amber-200 rounded-lg p-4">
                      {editingId === seva.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingData?.name || ''}
                            onChange={(e) => setEditingData({ ...editingData!, name: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                          />
                          <input
                            type="text"
                            value={editingData?.frequency || ''}
                            onChange={(e) => setEditingData({ ...editingData!, frequency: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                          />
                          <input
                            type="text"
                            value={editingData?.price || ''}
                            onChange={(e) => setEditingData({ ...editingData!, price: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="flex-1 bg-green-500 text-white py-2 rounded font-bold hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="flex-1 bg-gray-400 text-white py-2 rounded font-bold hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-3">
                            <p className="font-bold text-amber-900 text-lg">{seva.name}</p>
                            <p className="text-sm text-gray-600">Frequency: {seva.frequency}</p>
                            <p className="text-sm font-semibold text-orange-600">Price: {seva.price}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSeva(seva)}
                              className="flex-1 bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSeva(seva.id)}
                              className="flex-1 bg-red-500 text-white py-2 rounded font-bold hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
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
