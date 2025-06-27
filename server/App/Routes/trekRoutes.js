const express = require('express');
const trekModel = require('../Models/trekModel');
const Slot = require('../Models/Slot');
const router = express.Router();

// Add a trek to a district
router.post("/", async (req, res) => {
  try {
    const { name, districtId } = req.body;
    const trek = new trekModel({ name, district: districtId });
    await trek.save();
    res.status(201).json(trek);
  } catch (err) {
    res.status(500).json({ error: "Failed to add trek", message: err.message });
  }
});

// Get all treks for a specific district
router.get("/district/:districtId", async (req, res) => {
  try {
    const treks = await trekModel.find({ district: req.params.districtId }).populate("district");
    res.json(treks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch treks" });
  }
});


router.delete("/:id", async (req, res) => {
     console.log(req.params)
  try {
    await Slot.findByIdAndDelete(req.params.id);
    res.json({ message: "Trek deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete trek" });
  }
});

module.exports = router;
