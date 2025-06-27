const express = require("express");
const router = express.Router();
const upload = require("../Middleware/multer");

router.post("/", upload.single("image"), (req, res) => {
  const filePath = `http://localhost:8000/uploads/${req.file.filename}`;
  res.json({ imageUrl: filePath });
});

module.exports = router;
