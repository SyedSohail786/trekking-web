// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../Models/Message");

// POST: Save message
router.post("/", async (req, res) => {
  try {
    const { name, email, message,phone } = req.body;
    const newMsg = new Message({ name, email, message, phone });
    await newMsg.save();
    res.status(201).json({ success: true, message: "Message sent!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// GET: All messages (admin only)
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// DELETE /api/messages/:id
router.delete('/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

module.exports = router;
