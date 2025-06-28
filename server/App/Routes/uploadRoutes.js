const express = require("express");
const router = express.Router();
const upload = require("../Middleware/multer");
const dotenv = require("dotenv");
dotenv.config();

router.post("/", upload.single("image"), (req, res) => {
  const filePath = `${BACKEND_URL}/uploads/${req.file.filename}`;
  res.json({ imageUrl: filePath });
});

module.exports = router;
