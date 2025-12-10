"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { getAllRoomsAvailability } from "@/services/api";
import { RoomAvailabilityData } from "@/app/(pages)/types";
import { useRouter } from "next/navigation";

export default function RoomAvailabilityDates() {
    const router = useRouter();
    const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
    const [rooms, setRooms] = useState<RoomAvailabilityData[]>([]);

    const fetchAvailability = async (selectedDate: string) => {
        try {
            const res = await getAllRoomsAvailability(selectedDate);
            console.log("Fetched room availability:", res.data);
            setRooms(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAvailability(date);
    }, [date]);

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold mb-4">
                Room Availability for {format(new Date(date), "MMMM dd, yyyy")}
            </h1>

            {/* Date Selector */}
            <div className="mb-6">
                <label htmlFor="date" className="mr-2 font-medium">Select Date:</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded p-1"
                />
            </div>

            {/* Rooms */}
            {rooms.map((roomData) => (
                <div key={roomData.room.id} className="border rounded-lg shadow p-4 bg-white">
                    {/* Room Info */}
                    <div className="flex justify-between items-center mb-2">
                        {/* Left: Room name + capacity */}
                        <div>
                            <h2 className="text-xl font-semibold">{roomData.room.name}</h2>
                            <span className="text-sm text-gray-500">Capacity: {roomData.room.capacity}</span>
                        </div>

                        {/* Right: Book Now button */}
                        <button
                            onClick={() => router.push(`/booking/${roomData.room.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded shadow"
                        >
                            Book Now
                        </button>
                    </div>

                    <p className="text-gray-700 mb-2">{roomData.room.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {roomData.room.amenities.map((amenity, index) => (
                            <span
                                key={index}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                            >
                                {amenity}
                            </span>
                        ))}
                    </div>

                    {/* Available Dates */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {roomData.availableSlots.map((dateStr, index) => {
                            const isNext = dateStr === roomData.nextAvailableSlot;
                            const isLast = dateStr === roomData.lastAvailableSlot;
                            const formattedDate = format(parseISO(dateStr), "MMM dd, yyyy");
                            return (
                                <div
                                    key={index}
                                    className={`border rounded p-2 text-center text-sm font-medium 
                    ${isNext ? "bg-green-100 border-green-400" : ""} 
                    ${isLast ? "bg-yellow-100 border-yellow-400" : ""}`}
                                >
                                    <div>{formattedDate}</div>
                                    {isNext && <div className="text-green-700 text-xs mt-1">Next Available</div>}
                                    {isLast && <div className="text-yellow-700 text-xs mt-1">Last Available</div>}
                                </div>
                            );
                        })}
                    </div>

                    {/* Availability summary */}
                    <div className="mt-4 text-sm text-gray-600">
                        Total Available Days: {roomData.totalAvailableSlots} | Total Bookings: {roomData.totalBookings} | Available: {roomData.isAvailable ? "Yes" : "No"}
                    </div>
                </div>
            ))}
        </div>
    );
}
