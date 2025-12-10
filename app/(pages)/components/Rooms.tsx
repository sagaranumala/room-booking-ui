"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { 
  getRooms, 
  createRoom,
  deactivateRoom,
  activateRoom,
  permanentDeleteRoom 
} from "@/services/api";
import { useAuth } from "@/app/providers/AuthProvider";
import CreateRoomModal from "./CreateRoomModal";

export interface Room {
  _id?:string
  id: string;
  name: string;
  capacity: number;
  description?: string;
  amenities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { isAdmin } = useAuth();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await getRooms();
      const mappedRooms = res.data.data.map((room: Room) => ({
        id: room._id,
        name: room.name,
        capacity: room.capacity,
        description: room.description,
        amenities: room.amenities,
        isActive: room.isActive,
        createdAt: new Date(room.createdAt),
        updatedAt: new Date(room.updatedAt),
      }));
      setRooms(mappedRooms);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) return <div className="p-8 text-center text-lg">Loading rooms...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-16">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight animate-fade-in drop-shadow-lg">
            🏛 Available Rooms
          </h1>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-3xl shadow-xl text-lg font-semibold transition transform hover:-translate-y-1"
            >
              + Create Room
            </button>
          )}
        </div>

        {/* Rooms List */}
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {rooms.map((room, index) => {
              const gradients = [
                "from-fuchsia-500 to-purple-600",
                "from-indigo-500 to-blue-500",
                "from-emerald-400 to-teal-500",
                "from-yellow-400 to-orange-500",
                "from-pink-400 to-red-500",
              ];
              const bgGradient = gradients[index % gradients.length];

              return (
                <div
                  key={room.id}
                  className={`relative rounded-3xl shadow-2xl transform transition-all duration-500 hover:-translate-y-3 hover:shadow-3xl p-6 flex flex-col justify-between border-l-4 border-white overflow-hidden bg-gradient-to-r ${bgGradient} text-white animate-slide-up`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >

                  <div className="mb-4 text-center">
                    <h2 className="text-3xl font-extrabold tracking-wide drop-shadow-lg">
                      {room.name}
                    </h2>
                  </div>

                  <div className="flex-1">
                    {room.description && (
                      <p className="mb-3 text-white/90 text-base leading-relaxed">
                        {room.description}
                      </p>
                    )}
                    <p className="text-sm font-medium">
                      Capacity: <span className="font-bold">{room.capacity}</span>
                    </p>
                    {room.amenities.length > 0 && (
                      <p className="text-sm mt-2">
                        Amenities: <span className="font-medium">{room.amenities.join(", ")}</span>
                      </p>
                    )}
                    <p className="text-sm mt-1">
                      Status:{" "}
                      <span className={`font-semibold ${room.isActive ? "text-green-200" : "text-red-300"}`}>
                        {room.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={() => window.location.href = `/booking/${room.id}`}
                    className="mt-4 w-full font-semibold px-4 py-2 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg transition transform hover:-translate-y-1"
                  >
                    Book Now
                  </button>

                  {/* Admin Buttons */}
                  {isAdmin && (
                    <div className="mt-4 flex flex-col gap-3">
                      {/* Activate / Deactivate */}
                      <button
                        onClick={async () => {
                          try {
                            const action = room.isActive ? "Deactivate" : "Activate";
                            if (!confirm(`Are you sure you want to ${action} this room?`)) return;

                            if (room.isActive) {
                              await deactivateRoom(room.id);
                              toast.success("Room deactivated successfully");
                            } else {
                              await activateRoom(room.id);
                              toast.success("Room activated successfully");
                            }
                            fetchRooms();
                          } catch (err) {
                            console.error(err);
                            toast.error("Action failed");
                          }
                        }}
                        className={`w-full font-semibold px-4 py-2 rounded-2xl shadow-lg transition transform hover:-translate-y-1 ${
                          room.isActive
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        } text-white`}
                      >
                        {room.isActive ? "Deactivate" : "Activate"}
                      </button>

                      {/* Permanent Delete */}
                      <button
                        onClick={async () => {
                          try {
                            if (!confirm("This will permanently delete the room. Continue?")) return;
                            await permanentDeleteRoom(room.id);
                            toast.success("Room deleted permanently");
                            fetchRooms();
                          } catch (err) {
                            console.error(err);
                            toast.error("Failed to delete room");
                          }
                        }}
                        className="w-full font-semibold px-4 py-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg transition transform hover:-translate-y-1"
                      >
                        Delete Permanently
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-20">No rooms available.</div>
        )}

        {/* Create Room Modal */}
        <CreateRoomModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onCreate={async (data) => {
            try {
              await createRoom(data);
              toast.success("Room created successfully");
              fetchRooms();
              setShowModal(false);
            } catch (err) {
              console.error(err);
              toast.error("Failed to create room");
            }
          }}
        />

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease forwards; }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { opacity: 0; animation: slide-up 0.6s ease forwards; }
      `}</style>
    </div>
  );
}
