import BookingForm from "@/app/(pages)/components/BookingForm";

interface Params {
  roomId: string;
}

export default async function BookRoomPage({ params }: { params: Promise<Params> }) {
  const { roomId } = await params;
  const url = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${url}/rooms/${roomId}`, { cache: "force-cache" });

  if (!res.ok) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold text-lg">
          Room not found or server unavailable.
        </p>
      </div>
    );
  }

  const data = await res.json();
  const room = data.room || data || null;

  if (!room) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold text-lg">Room not found!</p>
      </div>
    );
  }

  const roomData = room.data;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl p-8">
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Book Room: {roomData.name}
        </h1>

        {/* Layout: Room Details + Booking Form */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* -------- Room Details Section -------- */}
          <div className="flex-1 bg-gray-50 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              🏠 Room Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5 text-gray-700">
              <div>
                <span className="font-medium text-gray-800 flex items-center gap-2">
                  🏷️ Name
                </span>
                <p className="text-gray-600">{roomData.name}</p>
              </div>

              <div>
                <span className="font-medium text-gray-800 flex items-center gap-2">
                  👥 Capacity
                </span>
                <p className="text-gray-600">{roomData.capacity} people</p>
              </div>

              <div>
                <span className="font-medium text-gray-800 flex items-center gap-2">
                  📌 Status
                </span>
                {roomData.isActive ? (
                  <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-sm font-semibold inline-block w-fit">
                    Available
                  </span>
                ) : (
                  <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-sm font-semibold inline-block w-fit">
                    Unavailable
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {roomData.description && (
              <div className="mb-6">
                <span className="font-medium text-gray-800 flex items-center gap-2 mb-1">
                  📝 Description
                </span>
                <p className="text-gray-600 leading-relaxed">{roomData.description}</p>
              </div>
            )}

            {/* Amenities */}
            {roomData.amenities?.length > 0 && (
              <div>
                <span className="font-medium text-gray-800 flex items-center gap-2 mb-2">
                  ⭐ Amenities
                </span>
                <div className="flex flex-wrap gap-2">
                  {roomData.amenities.map((item: string, i: number) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* -------- Booking Form Section -------- */}
          <div className="flex-1">
            <BookingForm room={roomData} />
          </div>
        </div>
      </div>
    </div>
  );
}
