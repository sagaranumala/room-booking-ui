"use client";

import { useState } from "react";

interface RescheduleModalProps {
  booking: any; // BookingData type works too
  onClose: () => void;
  onSubmit: (startTime: string, endTime: string) => void;
}

export default function RescheduleModal({
  booking,
  onClose,
  onSubmit,
}: RescheduleModalProps) {
  // Slice to "YYYY-MM-DDTHH:MM" format for input type="datetime-local"
  const [startTime, setStartTime] = useState(
    booking.startTime.slice(0, 16)
  );
  const [endTime, setEndTime] = useState(
    booking.endTime.slice(0, 16)
  );

  const handleSubmit = () => {
    if (!startTime || !endTime) {
      alert("Please select both start and end times");
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      alert("End time must be after start time");
      return;
    }
    onSubmit(startTime, endTime);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-96 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Reschedule Booking</h2>

        <label className="block mb-2 text-sm font-medium">New Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 text-sm font-medium">New End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-300"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="px-3 py-1 rounded bg-blue-600 text-white"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
