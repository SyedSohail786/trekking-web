import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Availability = () => {
  const query = new URLSearchParams(window.location.search);
  const trekId = query.get("trek");
  const date = query.get("date");

  const [slots, setSlots] = useState([]);
  const [slotId, setSlotId] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [visitors, setVisitors] = useState([{ name: "", age: "", gender: "" }]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/slots?trekId=${trekId}&date=${date}`);
        setSlots(res.data);
        if (res.data.length > 0) setSlotId(res.data[0]._id);
      } catch {
        toast.error("Failed to fetch slots");
      }
    };
    fetchSlots();
  }, [trekId, date]);

  const handleVisitorChange = (index, field, value) => {
    const updated = [...visitors];
    updated[index][field] = value;
    setVisitors(updated);
  };

  const addVisitor = () => {
    setVisitors([...visitors, { name: "", age: "", gender: "" }]);
  };

  const handleBooking = async () => {
    if (visitors.some(v => !v.name || !v.age || !v.gender)) {
      return toast.warning("Please fill all visitor fields");
    }

    if (visitors.length > (slots[0]?.capacity || 0)) {
      return toast.error("Not enough slots available");
    }

    try {
      const res = await axios.post("http://localhost:8000/api/bookings", {
        trekId,
        slotId,
        date,
        visitors
      });

      const ticketHtml = `
        <html>
          <head><title>Ticket</title></head>
          <body>
            <h2>Booking Confirmation</h2>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Trek ID:</strong> ${trekId}</p>
            <h3>Visitors:</h3>
            <ul>
              ${visitors.map(v => `<li>${v.name}, Age: ${v.age}, Gender: ${v.gender}</li>`).join("")}
            </ul>
          </body>
        </html>
      `;

      const blob = new Blob([ticketHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      toast.success("Booking successful");
      setVisitors([{ name: "", age: "", gender: "" }]);
      setShowBooking(false);
    } catch {
      toast.error("Booking failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Trek Availability</h1>

      {slots.length > 0 ? (
        <>
          <p className="mb-4">Available Slots: <strong>{slots[0].capacity}</strong></p>
          <button
            onClick={() => setShowBooking(true)}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Book Slot
          </button>
        </>
      ) : (
        <p>No slots available for the selected date and trek.</p>
      )}

      {showBooking && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">Visitor Details</h2>
          {visitors.map((visitor, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={visitor.name}
                onChange={(e) => handleVisitorChange(index, "name", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Age"
                value={visitor.age}
                onChange={(e) => handleVisitorChange(index, "age", e.target.value)}
                className="border p-2 rounded"
              />
              <select
                value={visitor.gender}
                onChange={(e) => handleVisitorChange(index, "gender", e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          ))}

          <button
            onClick={addVisitor}
            className="text-sm text-blue-600 hover:underline mr-2"
          >
            ➕ Add Another Visitor
          </button>

          <button
            onClick={handleBooking}
            className="mt-4 bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
          >
            Proceed to Book
          </button>
        </div>
      )}
    </div>
  );
};

export default Availability;
