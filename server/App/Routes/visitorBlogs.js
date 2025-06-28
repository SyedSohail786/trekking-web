const express = require("express");
const router = express.Router();
const VisitorBlog = require("../Models/VisitorBlog");
const upload = require("../Middleware/multer");

// CREATE
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, content, whatToCarry } = req.body;
    const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "";
    const blog = new VisitorBlog({
      title,
      content,
      whatToCarry: JSON.parse(whatToCarry || "[]"),
      image,
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to create blog", error: err.message });
  }
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const blogs = await VisitorBlog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs", error: err.message });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const blog = await VisitorBlog.findById(req.params.id);
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blog", error: err.message });
  }
});

// UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, content, whatToCarry } = req.body;
    const updateData = {
      title,
      content,
      whatToCarry: JSON.parse(whatToCarry || "[]"),
    };

    if (req.file) {
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const blog = await VisitorBlog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to update blog", error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await VisitorBlog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete blog", error: err.message });
  }
});

module.exports = router;
