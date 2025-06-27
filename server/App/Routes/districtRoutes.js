const express = require('express');
const router = express.Router();
const District = require('../Models/DistrictModel');

// Add a new district
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const district = new District({ name });
    await district.save();
    res.status(201).json(district);
  } catch (err) {
    res.status(500).json({ error: "Failed to add district", message: err.message });
  }
});

// Get all districts
router.get("/", async (req, res) => {
  try {
    const districts = await District.find();
    res.json(districts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch districts" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await District.findByIdAndDelete(req.params.id);
    res.json({ message: "District deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete district" });
  }
});

module.exports = router;
