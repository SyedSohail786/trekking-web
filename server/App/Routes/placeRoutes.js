const express = require("express");
const router = express.Router();
const TrekPlace = require("../Models/TrekPlace");

// Add a new place
router.post("/", async (req, res) => {
  try {
    const newPlace = new TrekPlace(req.body);
    await newPlace.save();
    res.status(201).json({ message: "Trek place added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add trek place" });
  }
});

// Get all trek places
router.get("/", async (req, res) => {
  try {
    const places = await TrekPlace.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

router.get("/:id", async (req, res) => {
  try {
     const id = req.params.id;
    const place = await TrekPlace.findById(id);
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
}); 

router.put("/:id", async (req, res) => {
  const updated = await TrekPlace.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await TrekPlace.findByIdAndDelete(req.params.id);
  res.json({ message: "Trek deleted" });
});

module.exports = router;
