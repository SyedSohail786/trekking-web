const express = require("express");
const router = express.Router();
const Booking = require("../Models/Booking");
const { Parser } = require("json2csv");

router.get("/export", async (req, res) => {
  try {
    const { start, end } = req.query;

if (!start || !end) {
  return res.status(400).json({ error: "Start and end dates required" });
}

// Convert date to string format 'YYYY-MM-DD' for exact string matching
const startDateStr = new Date(start).toISOString().slice(0, 10); // "2025-06-28"
const endDateStr = new Date(end).toISOString().slice(0, 10);

const bookings = await Booking.find({
  date: { $gte: startDateStr, $lte: endDateStr }
}).populate("trekId slotId");


    const rows = bookings.flatMap((booking) =>
      booking.visitors.map((visitor) => ({
        BookingDate: new Date(booking.date).toLocaleDateString(),
        TrekName: booking.trekId?.name || "N/A",
        SlotTime: booking.slotId?.time || "N/A",
        VisitorName: visitor.name,
        Age: visitor.age,
        Gender: visitor.gender,
      }))
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "No visitor data found for selected range." });
    }

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="visitors_${start}_to_${end}.csv"`);
    res.status(200).send(csv);
  } catch (err) {
    console.error("CSV Export Error:", err);
    res.status(500).json({ error: "Failed to export CSV" });
  }
});


module.exports = router;
