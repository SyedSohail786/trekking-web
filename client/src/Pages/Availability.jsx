import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Cookies from "js-cookie";


const Availability = () => {
  const [searchParams] = useSearchParams();
  const trekId = searchParams.get("trek");
  const date = searchParams.get("date");
  const navigate = useNavigate()
  const [slots, setSlots] = useState([]);
  const [slotId, setSlotId] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [visitors, setVisitors] = useState([{ name: "", age: "", gender: "" }]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/slots?trekId=${trekId}&date=${date}`);
        setSlots(res.data);
        if (res.data.length > 0) setSlotId(res.data[0]._id);
      } catch {
        toast.error("Failed to fetch slots");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlots();
  }, [trekId, date]);

  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/slots?trekId=${trekId}&date=${date}`);
      setSlots(res.data);
      if (res.data.length > 0) setSlotId(res.data[0]._id);
    } catch {
      toast.error("Failed to fetch slots");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisitorChange = (index, field, value) => {
    const updated = [...visitors];
    updated[index][field] = value;
    setVisitors(updated);
  };

  const addVisitor = () => {
    if (visitors.length >= (slots[0]?.capacity || 10)) {
      toast.warn(`Maximum ${slots[0]?.capacity} visitors allowed`);
      return;
    }
    setVisitors([...visitors, { name: "", age: "", gender: "" }]);
  };

  const removeVisitor = (index) => {
    if (visitors.length === 1) return;
    const updated = [...visitors];
    updated.splice(index, 1);
    setVisitors(updated);
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Create a temporary div for PDF generation
      const ticketDiv = document.createElement("div");
      ticketDiv.style.position = "absolute";
      ticketDiv.style.left = "-9999px";
      ticketDiv.style.width = "600px";
      ticketDiv.style.padding = "20px";
      ticketDiv.style.backgroundColor = "white";

      // Ticket HTML content
      ticketDiv.innerHTML = `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: white; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Trek Booking Confirmation</h1>
            <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <!-- Content -->
          <div style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              <div>
                <p style="margin: 0 0 4px; font-size: 14px; color: #64748b;">Booking Reference</p>
                <p style="margin: 0; font-size: 16px; font-weight: 600;">TRK-${trekId}-${Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
              <div>
                <p style="margin: 0 0 4px; font-size: 14px; color: #64748b;">Trek ID</p>
                <p style="margin: 0; font-size: 16px; font-weight: 600;">${trekId}</p>
              </div>
            </div>

            <!-- Visitors -->
            <h2 style="margin: 0 0 16px; font-size: 20px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
              Visitors (${visitors.length})
            </h2>
            
            ${visitors.map((v, i) => `
              <div style="background: #f8fafc; padding: 16px; margin-bottom: 12px; border-radius: 6px; border-left: 4px solid #047857;">
                <h3 style="margin: 0 0 8px; font-size: 16px; color: #1e293b;">Visitor ${i + 1}</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                  <div>
                    <p style="margin: 0 0 4px; font-size: 12px; color: #64748b;">Name</p>
                    <p style="margin: 0; font-size: 14px;">${v.name}</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 4px; font-size: 12px; color: #64748b;">Age</p>
                    <p style="margin: 0; font-size: 14px;">${v.age}</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 4px; font-size: 12px; color: #64748b;">Gender</p>
                    <p style="margin: 0; font-size: 14px;">${v.gender}</p>
                  </div>
                </div>
              </div>
            `).join('')}

            <!-- QR Code -->
            <div style="text-align: center; margin: 32px 0; padding: 16px; background: #f8fafc; border-radius: 8px;">
              <p style="margin: 0 0 12px; font-size: 14px; color: #64748b;">Present this code at check-in</p>
              <div style="width: 150px; height: 150px; background: white; margin: 0 auto; display: flex; align-items: center; justify-content: center; border: 1px dashed #cbd5e0; padding: 8px;">
                <div style="text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #64748b;">QR Code</p>
                  <p style="margin: 8px 0 0; font-size: 10px; color: #94a3b8;">TRK-${trekId}</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; color: #64748b; font-size: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px;">Thank you for choosing our trekking service!</p>
              <p style="margin: 0;">For any questions, contact support@trekadventures.com</p>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(ticketDiv);

      // Convert to canvas then to PDF
      const canvas = await html2canvas(ticketDiv, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
      pdf.save(`TrekBooking_${trekId}_${new Date().toISOString().slice(0, 10)}.pdf`);

      toast.success("🎫 Ticket downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate ticket");
    } finally {
      setIsGeneratingPDF(false);
      // Clean up temporary elements
      const elements = document.querySelectorAll('[style*="left: -9999px"]');
      elements.forEach(el => el.remove());
    }
  };

  const handleBooking = async () => {
    if (visitors.some(v => !v.name || !v.age || !v.gender)) {
      return toast.warning("Please fill all visitor fields");
    }

    if (visitors.length > (slots[0]?.capacity || 0)) {
      return toast.error(`Maximum ${slots[0]?.capacity} visitors allowed per booking`);
    }

    try {
      const res = await axios.post("http://localhost:8000/api/bookings", {
        trekId,
        slotId,
        date,
        visitors
      });

      toast.success("🎉 Booking successful! Generating your ticket...");
      await generatePDF();
      fetchSlots()
      setVisitors([{ name: "", age: "", gender: "" }]);
      setShowBooking(false);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Booking failed. Please try again.");
    }
  };


  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 min-h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const handleBookNow = (e) => {
    e.preventDefault();
    const token = Cookies.get("token") ;
    if (!token) {
      toast.info("Please login to continue");
       navigate("/login")
    } else {
      setShowBooking(true);
    }
  };


  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Trek Availability</h1>
          <p className="opacity-90 mt-1">
            {date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {slots.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg w-full sm:w-auto">
                  <p className="text-gray-600 text-sm">Available slots</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-green-700">{slots[0].capacity}</span>
                    <span className="text-gray-500">/ {slots[0].maxCapacity}</span>
                  </div>
                </div>
                <button
                  onClick={handleBookNow}
                  disabled={slots[0].capacity === 0}
                  className={`px-6 py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 w-full sm:w-auto ${slots[0].capacity === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                >
                  {slots[0].capacity === 0 ? "Fully Booked" : "Book Now"}
                </button>

              </div>

              {showBooking && (
                <div className="mt-8 space-y-6 border-t pt-6">
                  <h2 className="text-xl font-semibold text-gray-800">Visitor Information</h2>
                  <p className="text-gray-600">Please provide details for each visitor</p>

                  {visitors.map((visitor, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-700">Visitor {index + 1}</h3>
                        {visitors.length > 1 && (
                          <button
                            onClick={() => removeVisitor(index)}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                          <input
                            type="text"
                            value={visitor.name}
                            onChange={(e) => handleVisitorChange(index, "name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Age*</label>
                          <input
                            type="number"
                            value={visitor.age}
                            onChange={(e) => handleVisitorChange(index, "age", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="25"
                            min="1"
                            max="99"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender*</label>
                          <select
                            value={visitor.gender}
                            onChange={(e) => handleVisitorChange(index, "gender", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addVisitor}
                    disabled={visitors.length >= (slots[0]?.capacity || 10)}
                    className={`flex items-center text-sm font-medium ${visitors.length >= (slots[0]?.capacity || 10)
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-green-600 hover:text-green-800"
                      }`}
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Another Visitor
                  </button>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <button
                      onClick={() => setShowBooking(false)}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBooking}
                      disabled={isGeneratingPDF}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {isGeneratingPDF ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No slots available</h3>
              <p className="mt-1 text-gray-500">There are no available slots for the selected date and trek.</p>
              <button
                onClick={() => window.history.back()}
                className="mt-4 px-4 py-2 text-sm text-green-600 hover:text-green-800 flex items-center justify-center gap-1 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Treks
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Availability;