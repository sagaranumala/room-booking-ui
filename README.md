# Max Room Booking System

This project is a **room booking system** with a backend (Node.js/Express + MongoDB) and a frontend (React/Next.js). It supports user authentication, room management, and booking with conflict handling.

---

## Table of Contents

* [How to Run Backend](#how-to-run-backend)
* [How to Run Frontend](#how-to-run-frontend)
* [Booking Conflict Logic Explained](#booking-conflict-logic-explained)
* [Authentication Flow Explained](#authentication-flow-explained)

---

## How to Run Backend

1. **Clone the repository**

```bash
git clone <repository-url>
cd max-room-booking
```

2. **Install dependencies**

```bash
cd backend
npm install
```

3. **Configure environment variables**

Create a `.env` file in `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/max-room-booking
JWT_SECRET=your_secret_key
```

4. **Run backend**

```bash
# For development with hot reload
npm run dev

# For production
npm start
```

The backend runs on `http://localhost:5000`.

---

## How to Run Frontend

1. **Install dependencies**

```bash
cd frontend
npm install
```

2. **Configure environment variables**

Create a `.env.local` file in `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. **Run frontend**

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The frontend runs on `http://localhost:3000`.

---

## Booking Conflict Logic Explained

The system prevents overlapping bookings for the **same room**.

**Conflict rules:**

1. When creating or rescheduling a booking:

   * `startTime` and `endTime` are checked against all **existing confirmed or active bookings** for that room.
   * A conflict exists if:

     ```
     requestedStartTime < existingEndTime &&
     requestedEndTime > existingStartTime
     ```
2. If a conflict exists, the booking request is rejected with a message:

```json
{
  "success": false,
  "message": "Room is not available for the selected time range"
}
```

3. Optionally, when rescheduling, you can **exclude the current booking** from the conflict check.

---

## Authentication Flow Explained

1. **User Registration & Login**

   * Users register with `name`, `email`, and `password`.
   * Passwords are hashed before storing in the database.
   * JWT token is issued upon successful login.

2. **Token-Based Authentication**

   * Protected routes require a valid JWT token in the `Authorization` header:

     ```
     Authorization: Bearer <token>
     ```
   * Middleware verifies the token and attaches user info to `req.user`.

3. **Role-Based Access**

   * Users have roles: `user` or `admin`.
   * Certain routes (like listing all bookings, grouping by room) are restricted to `admin`.

4. **Session Flow**

   1. User logs in → receives JWT.
   2. Client stores JWT (localStorage or cookie).
   3. Client sends JWT on each API request.
   4. Backend validates token → allows or denies access.

---

✅ **Optional Improvements for README**

* Add screenshots of the UI.
* Add API endpoint list with request/response examples.
* Add testing instructions (Postman collection or automated tests).
