"use client";

import { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBooking } from "@/services/api";
import { Room } from "../types";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  room: Room;
}

export type BookingData = {
  roomId: string;
  startTime: string;
  endTime: string;
};

export default function BookingForm({ room }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const roomId = room._id;
   const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;

    const formData = new FormData(e.currentTarget);
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    try {
      setLoading(true);
      const bookingData: BookingData = { roomId, startTime, endTime };
      const res = await createBooking(bookingData);

      if (!res || (res.status !== 200 && res.status !== 201)) {
        toast.error(res?.data?.message || "Booking failed");
        return;
      }

      toast.success("Booking successful!");
      // e.currentTarget.reset();
      router.push("/mybookings");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Booking failed";
      toast.error(errorMessage || "Booking failed");
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  return (
    <div className="w-full">
      <ToastContainer position="top-right" autoClose={3000} />

      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 p-6 rounded-xl shadow-md space-y-5"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md"
          }`}
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </form>

      <p className="mt-4 text-gray-500 text-sm text-center">
        Room Capacity: {room.capacity}
      </p>
    </div>
  );
}
