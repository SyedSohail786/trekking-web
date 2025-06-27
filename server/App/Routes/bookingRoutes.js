const express = require("express");
const router = express.Router();
const Booking = require("../Models/Booking");
const Slot = require("../Models/Slot");

router.post("/", async (req, res) => {
  try {
    const { trekId, slotId, date, visitors } = req.body;

    if (!trekId || !slotId || !date || !visitors?.length) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ error: "Slot not found" });

    if (slot.capacity < visitors.length) {
      return res.status(400).json({ error: "Not enough slots available" });
    }

    const booking = new Booking({ trekId, slotId, date, visitors });
    await booking.save();

    slot.capacity -= visitors.length;
    await slot.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ error: "Booking failed" });
  }
});

module.exports = router; // ✅ this is very important
