"use client";

import { useState } from "react";
import Protected from "./(pages)/components/Protected";
import { useAuth } from "@/app/providers/AuthProvider";
import RoomsPage from "./(pages)/components/Rooms";
import AdminBookings from "./(pages)/components/AllBookings";
import RoomAvailability from "./(pages)/components/RoomAvailability";
import RoomAvailabilityDates from "./(pages)/components/RoomAvailabilityDates";
import RoomAvailabilityToggle from "./(pages)/components/RoomAvailabilityToggle";

export default function Page() {
  const { logout, user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"rooms" | "bookings">("rooms");

  return (
    <Protected>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name || user?.email}
          </h2>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Admin Tabs */}
        {isAdmin ? (
          <div className="mb-6">
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab("rooms")}
                className={`px-4 py-2 -mb-px font-medium text-sm transition ${activeTab === "rooms"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Rooms
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 -mb-px font-medium text-sm transition ${activeTab === "bookings"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                All Bookings
              </button>
            </div>

            <div>
              {activeTab === "rooms" && <RoomsPage />}
              {activeTab === "bookings" && <AdminBookings />}
            </div>
          </div>
        ) : (
          // Regular user sees only RoomsPage
          // <RoomsPage />
          <RoomAvailabilityToggle/>

        )}
      </div>
    </Protected>
  );
}
