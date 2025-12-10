import { RoomAvailabilityData, RoomAvailabilitySlots} from "@/app/(pages)/types";
import { BookingData } from "../app/(pages)/components/BookingForm";
import axios from "axios";

// API Base URL
const API_URL = "http://localhost:5000/api";
console.log("API URL:", API_URL);

// Create Axios instance
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ include cookies in requests
});

// ------------------- REQUEST INTERCEPTOR -------------------
// Automatically attach JWT token to all requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// // ------------------- EVENTS -------------------

// // Get single event by eventId
// export const getByEventId = (eventId: string) =>
//   api.get(`/events/${eventId}`);

// // Create a new event (Admin only)
// export const createEvent = (event: {
//   title: string;
//   description?: string;
//   location?: string;
//   startAt: string;
//   totalSeats: number;
// }) => api.post("/events/create", event);

// // Delete an event by eventId (Admin only)
// export const deleteEvent = (eventId: string) => api.delete(`/events/${eventId}`);

// ------------------- BOOKINGS -------------------

// Create a new booking
export const createBooking = (booking: BookingData) =>
  api.post("/bookings", booking);

// Get all bookings (optional: admin)
export const getBookings = () => api.get("/bookings");

// Get bookings by user
export const getUserBookings = () =>
  api.get(`/bookings/me`);

export const cancelBooking = (bookingId: string) =>
  api.delete(`/bookings/${bookingId}/cancel`);

export const rescheduleBooking = (
  bookingId: string,
  data: { startTime: string; endTime: string }
) => api.patch(`/bookings/${bookingId}/reschedule`, data);

// admin
export const getAllBookings = () => api.get("/bookings/admin/all");

// ------------------- ROOMS -------------------

// Get all rooms
export const getRooms = () => api.get("/rooms");

// Get all rooms availability for a specific date
export const getAllRoomsAvailability = (date: string) =>
  api.get<{ success: boolean; data: RoomAvailabilityData[] }>(
    `/rooms/allroomsavailability?date=${date}`
  );

  export const getAllRoomsAvailabilitySlots = (date: string) =>
  api.get<{ success: boolean; data: RoomAvailabilitySlots[] }>(
    `/rooms/availabilityslots?date=${date}`
  )

// Get single room by ID
export const getRoomById = (roomId: string) =>
  api.get(`/rooms/${roomId}`);

// Admin only APIs

// Create a new room (Admin only)
export const createRoom = (room: {
  name: string;
  capacity: number;
  description?: string;
  amenities?: string[];
  isActive?: boolean;
}) => api.post("/rooms", room);

// Update a room by ID (Admin only)
export const updateRoom = (
  roomId: string,
  room: Partial<{
    name: string;
    capacity: number;
    description?: string;
    amenities?: string[];
    isActive?: boolean;
  }>
) => api.put(`/rooms/${roomId}`, room);

export const deactivateRoom = (id: string) =>
  api.patch(`/rooms/${id}/deactivate`);

export const activateRoom = (id: string) =>
  api.patch(`/rooms/${id}/activate`);

export const permanentDeleteRoom = (id: string) =>
  api.delete(`/rooms/${id}/permanent`);

