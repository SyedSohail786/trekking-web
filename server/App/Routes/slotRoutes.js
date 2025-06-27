const express = require('express');
const Slot = require('../Models/Slot');
const trekModel = require('../Models/trekModel');
const router = express.Router();

// Add slot for a trek
router.post("/", async (req, res) => {
  const { trekId, date, time, capacity } = req.body;
  const slot = new Slot({ trek: trekId, date, time, capacity });
  await slot.save();
  res.status(201).json(slot);
});

// Get slots by trek/date
router.get("/", async (req, res) => {
  const { trekId, date } = req.query;
  const slots = await Slot.find({ trek: trekId, date });
  res.json(slots);
});

router.put("/:id", async (req, res) => {
  try {
    const { time, capacity } = req.body;
    const updated = await Slot.findByIdAndUpdate(
      req.params.id,
      { time, capacity },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update slot" });
  }
});


module.exports = router;
