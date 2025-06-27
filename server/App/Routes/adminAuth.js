const express = require('express');
const AdminUser = require('../Models/AdminUser');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register admin (once only, or create manually in DB)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const existing = await AdminUser.findOne({ email });
  if (existing) return res.status(400).json({ message: "Admin already exists" });
  const admin = new AdminUser({ email, password });
  await admin.save();
  res.json({ message: "Admin registered" });
});

// Login admin
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await AdminUser.findOne({ email });
  if (!admin || !(await admin.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

module.exports = router;
