const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String
});

const bookingSchema = new mongoose.Schema({
  trekId: { type: mongoose.Schema.Types.ObjectId, ref: "Trek" },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot" },
  date: String,
  visitors: [visitorSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
