const express = require("express");
const router = express.Router();
const TrekPlace = require("../Models/TrekPlace");
const upload = require("../Middleware/multer");
const path = require("path");
const fs = require("fs");


//helper function
const handleFileUpload = (file, req) => {
  if (!file) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
};

// Add a new place
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { title, location, description, fullDetails, stats } = req.body;

      // ✅ Check if a trek with the same title and location already exists
      const alreadyExists = await TrekPlace.findOne({ title, location });
      if (alreadyExists) {
        return res.status(409).json({ message: "Trek already exists" });
      }

      // ✅ Parse fullDetails safely
      let parsedFullDetails = [];
      try {
        parsedFullDetails =
          typeof fullDetails === "string"
            ? JSON.parse(fullDetails)
            : fullDetails || [];
      } catch (e) {
        parsedFullDetails = [];
      }

      // ✅ Parse stats safely
      let parsedStats = [];
      try {
        parsedStats =
          typeof stats === "string" ? JSON.parse(stats) : stats || [];
      } catch (e) {
        parsedStats = [];
      }

      // ✅ Handle images
      const mainImage =
        req.files?.image?.[0] && handleFileUpload(req.files.image[0], req);
      const galleryImages = req.files?.gallery?.map((file) =>
        handleFileUpload(file, req)
      ) || [];

      // ✅ Create document
      const newTrekPlace = new TrekPlace({
        title,
        image: mainImage || "",
        location,
        description,
        fullDetails: parsedFullDetails,
        stats: parsedStats,
        gallery: galleryImages,
      });

      await newTrekPlace.save();

      return res.status(201).json(newTrekPlace);
    } catch (error) {
      console.error("Trek creation error:", error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;




// Get all trek places
router.get("/", async (req, res) => {
  try {
    const places = await TrekPlace.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

//get single trekk
router.get("/:id", async (req, res) => {
  try {
     const id = req.params.id;
    const place = await TrekPlace.findById(id);
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
}); 

//Upadte
router.put("/:id", upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]), async (req, res) => {
  try {
    const { title, location, description, fullDetails, stats } = req.body;
    const trekPlace = await TrekPlace.findById(req.params.id);
    
    if (!trekPlace) {
      return res.status(404).json({ message: "Trek place not found" });
    }

    // Parse array fields
    const parsedFullDetails = typeof fullDetails === 'string' ? JSON.parse(fullDetails) : fullDetails || [];
    const parsedStats = typeof stats === 'string' ? JSON.parse(stats) : stats || [];

    // Handle main image - keep existing if no new one uploaded
    let mainImage = trekPlace.image;
    if (req.files && req.files['image'] && req.files['image'][0]) {
      // Delete old image if exists
      if (trekPlace.image) {
        const oldFilename = trekPlace.image.split('/').pop();
        try {
          fs.unlinkSync(path.join(__dirname, '../uploads', oldFilename));
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      mainImage = handleFileUpload(req.files['image'][0], req);
    }

    // Handle gallery images - combine existing with new ones
    let galleryImages = [...trekPlace.gallery];
    if (req.files && req.files['gallery']) {
      const newGalleryImages = req.files['gallery'].map(file => handleFileUpload(file, req));
      galleryImages = [...galleryImages, ...newGalleryImages];
    }

    // Update the trek place
    trekPlace.title = title;
    if (mainImage) trekPlace.image = mainImage;
    trekPlace.location = location;
    trekPlace.description = description;
    trekPlace.fullDetails = parsedFullDetails;
    trekPlace.stats = parsedStats;
    trekPlace.gallery = galleryImages;

    await trekPlace.save();
    res.json(trekPlace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  await TrekPlace.findByIdAndDelete(req.params.id);
  res.json({ message: "Trek deleted" });
});

module.exports = router;
