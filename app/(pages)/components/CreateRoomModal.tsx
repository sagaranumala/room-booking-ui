"use client";

import { useState } from "react";

interface CreateRoomModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    capacity: number;
    description?: string;
    amenities: string[];
    isActive: boolean;
  }) => Promise<void>;
}

export default function CreateRoomModal({ show, onClose, onCreate }: CreateRoomModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    description: "",
    amenities: "",
    isActive: true,
  });
  const [creating, setCreating] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.capacity) {
      alert("Please fill in all required fields");
      return;
    }

    setCreating(true);
    try {
      await onCreate({
        name: formData.name,
        capacity: Number(formData.capacity),
        description: formData.description,
        amenities: formData.amenities.split(",").map((a) => a.trim()).filter((a) => a),
        isActive: formData.isActive,
      });
      setFormData({ name: "", capacity: "", description: "", amenities: "", isActive: true });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8 relative animate-slide-up">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Room</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Capacity *</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Amenities (comma separated)</label>
            <input
              type="text"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              id="isActive"
              className="h-4 w-4 accent-green-500"
            />
            <label htmlFor="isActive" className="text-gray-700">
              Active
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={creating}
            className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 font-semibold transition"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.4s ease forwards; }
      `}</style>
    </div>
  );
}
