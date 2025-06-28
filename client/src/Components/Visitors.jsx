import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { saveAs } from 'file-saver';
import { FiDownload, FiCalendar, FiClock, FiUsers, FiUser, FiFilter } from "react-icons/fi";

const Visitors = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/bookings");
        setBookings(res.data);
      } catch (err) {
        toast.error("Failed to load visitor bookings");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8000/api/bookings/export?start=${startDate}&end=${endDate}`,
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8" });
      saveAs(blob, `visitors_${startDate}_to_${endDate}.csv`);
      toast.success("CSV exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV");
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Visitor Bookings</h1>
              <p className="mt-1 text-green-100">
                Manage and export visitor booking data
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiFilter className="mr-2" />
                Filter Options
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiCalendar className="inline mr-2" />
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiCalendar className="inline mr-2" />
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div>
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <FiDownload className="mr-2" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <FiUsers className="w-full h-full" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-gray-500">There are no visitor bookings in the system yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  {/* Booking Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {booking.trekId?.name || "Unspecified Trek"}
                        </h2>
                        <div className="flex items-center mt-1 space-x-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FiCalendar className="mr-1" />
                            {new Date(booking.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <FiClock className="mr-1" />
                            {booking.slotId?.time || "Time not specified"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <FiUsers className="mr-1" />
                          {booking.visitors.length} visitor{booking.visitors.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visitors List */}
                  <div className="p-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                      Visitor Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {booking.visitors.map((visitor, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:bg-gray-100 transition-colors">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <FiUser className="h-5 w-5 text-green-600" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900">{visitor.name}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {visitor.age} years
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {visitor.gender}
                                </span>
                                {visitor.phone && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {visitor.phone}
                                  </span>
                                )}
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