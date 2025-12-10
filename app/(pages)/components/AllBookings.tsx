"use client";

import { useEffect, useState } from "react";
import { getAllBookings } from "@/services/api";
import { format } from "date-fns";

interface Booking {
  _id: string;
  roomId: { name: string };
  userId: { email: string };
  startTime: string;
  endTime: string;
  status: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching admin bookings...");
        const res = await getAllBookings();
        console.log("Response from API:", res);
        setBookings(res.data?.data || res.data || []);
      } catch (err: any) {
        console.error("Failed to fetch all bookings:", err);
        setError(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  if (loading) return <p className="text-center py-10 text-lg">Loading all bookings...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (bookings.length === 0) return <p className="text-center py-10 text-gray-500">No bookings found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Bookings</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700 font-semibold uppercase text-sm">Room</th>
              <th className="px-6 py-3 text-left text-gray-700 font-semibold uppercase text-sm">User</th>
              <th className="px-6 py-3 text-left text-gray-700 font-semibold uppercase text-sm">Start</th>
              <th className="px-6 py-3 text-left text-gray-700 font-semibold uppercase text-sm">End</th>
              <th className="px-6 py-3 text-left text-gray-700 font-semibold uppercase text-sm">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="px-6 py-4 text-gray-800 font-medium">{b.roomId?.name || "N/A"}</td>
                <td className="px-6 py-4 text-gray-600">{b.userId?.email || "N/A"}</td>
                <td className="px-6 py-4 text-gray-600">{format(new Date(b.startTime), "PPP pp")}</td>
                <td className="px-6 py-4 text-gray-600">{format(new Date(b.endTime), "PPP pp")}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      b.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : b.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
