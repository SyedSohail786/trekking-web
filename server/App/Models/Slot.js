const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  trek: { type: mongoose.Schema.Types.ObjectId, ref: 'Trek', required: true },
  date: { type: String, required: true }, // yyyy-mm-dd
  time: { type: String, required: true }, // e.g., "9:00 AM"
  capacity: { type: Number, required: true }
});

module.exports = mongoose.model('Slot', slotSchema);
