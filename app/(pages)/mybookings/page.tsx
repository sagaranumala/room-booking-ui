"use client";

import { useEffect, useState } from "react";
import { getUserBookings, cancelBooking, rescheduleBooking } from "@/services/api";
import { BookingData } from "../types";
import { format } from "date-fns";
import RescheduleModal from "../components/ResheduleBookingModal";

export default function UserBookings() {
  const [bookings, setBookings] = useState<BookingData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleBookingData, setRescheduleBookingData] = useState<BookingData | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await getUserBookings();
      setBookings(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      setCancellingId(id);
      await cancelBooking(id);
      await fetchBookings();
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const handleReschedule = async (id: string, start: string, end: string) => {
    try {
      setReschedulingId(id);
      await rescheduleBooking(id, {
        startTime: new Date(start).toISOString(),
        endTime: new Date(end).toISOString(),
      });
      await fetchBookings();
      alert("Booking rescheduled successfully!");
      setRescheduleBookingData(null);
    } catch (err) {
      console.error("Reschedule failed:", err);
      alert("Failed to reschedule booking");
    } finally {
      setReschedulingId(null);
    }
  };

  if (loading || bookings === null) {
    return (
      <div className="flex justify-center items-center h-40 text-lg font-medium">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Room</th>
                <th className="px-4 py-3 text-left font-semibold">Amenities</th>
                <th className="px-4 py-3 text-left font-semibold">Start</th>
                <th className="px-4 py-3 text-left font-semibold">End</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{b.roomId?.name}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {b.roomId?.amenities?.join(", ")}
                  </td>
                  <td className="px-4 py-3">{format(new Date(b.startTime), "PPP pp")}</td>
                  <td className="px-4 py-3">{format(new Date(b.endTime), "PPP pp")}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${
                        b.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : b.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 flex gap-2">
                    {b.status !== "cancelled" ? (
                      <>
                        <button
                          onClick={() => handleCancel(b._id)}
                          disabled={cancellingId === b._id}
                          className={`px-3 py-1 rounded text-sm font-medium text-white ${
                            cancellingId === b._id
                              ? "bg-red-300 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {cancellingId === b._id ? "Cancelling..." : "Cancel"}
                        </button>

                        <button
                          onClick={() => setRescheduleBookingData(b)}
                          disabled={reschedulingId === b._id}
                          className={`px-3 py-1 rounded text-sm font-medium text-white ${
                            reschedulingId === b._id
                              ? "bg-blue-300 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          {reschedulingId === b._id ? "Saving..." : "Reschedule"}
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleBookingData && (
        <RescheduleModal
          booking={rescheduleBookingData}
          onClose={() => setRescheduleBookingData(null)}
          onSubmit={(start, end) =>
            handleReschedule(rescheduleBookingData._id, start, end)
          }
        />
      )}
    </div>
  );
}
