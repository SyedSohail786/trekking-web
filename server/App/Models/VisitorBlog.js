const mongoose = require("mongoose");

const visitorBlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  whatToCarry: { type: [String], default: [] },
  image: { type: String }, // Image URL
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("VisitorBlog", visitorBlogSchema);
