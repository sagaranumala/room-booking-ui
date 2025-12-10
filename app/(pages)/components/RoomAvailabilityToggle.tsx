"use client";

import { useState } from "react";
import RoomAvailability from "./RoomAvailability";
import RoomAvailabilityDates from "./RoomAvailabilityDates";

export default function RoomAvailabilityToggle() {
  const [activeTab, setActiveTab] = useState<"hours" | "days">("hours");

  return (
    <div className="p-4 bg-gradient-to-b from-gray-100 to-gray-200 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Room Availability</h1>

      {/* ---- Toggle Buttons ---- */}
      <div className="flex justify-center space-x-3 mb-6">
        <button
          onClick={() => setActiveTab("hours")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition 
            ${activeTab === "hours" ? "bg-blue-600 text-white shadow" : "bg-gray-200 hover:bg-gray-300"}
          `}
        >
          By Hours
        </button>

        <button
          onClick={() => setActiveTab("days")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition 
            ${activeTab === "days" ? "bg-blue-600 text-white shadow" : "bg-gray-200 hover:bg-gray-300"}
          `}
        >
          By Days
        </button>
      </div>

      {/* ---- Render Hours / Days ---- */}
      <div className="mt-4">
        {activeTab === "hours" ? <RoomAvailability /> : <RoomAvailabilityDates />}
      </div>
    </div>
  );
}
