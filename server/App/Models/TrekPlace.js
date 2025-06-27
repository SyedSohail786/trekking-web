const mongoose = require("mongoose");

const TrekPlaceSchema = new mongoose.Schema({
  title: String,
  image: String,
  location: String,
  description: String,
  fullDetails: [String],
  stats: [
    {
      label: String,
      value: String
    }
  ],
  gallery: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("TrekPlace", TrekPlaceSchema);
