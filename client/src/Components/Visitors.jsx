import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Visitors = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/bookings");
        setBookings(res.data);
      } catch (err) {
        toast.error("Failed to load visitor bookings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">Visitor Bookings</h1>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-gray-500">There are no visitor bookings yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {booking.trekId?.name || "Unspecified Trek"}
                      </h2>
                      <div className="flex items-center gap-4 mt-2 sm:mt-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {new Date(booking.date).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {booking.slotId?.time || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Visitors ({booking.visitors.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {booking.visitors.map((visitor, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-600 font-medium">
                                  {visitor.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900">{visitor.name}</p>
                              <div className="flex space-x-2 mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  Age: {visitor.age}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {visitor.gender}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visitors;