// models/Trek.js
const mongoose = require('mongoose');

const trekSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true
  }
});

module.exports = mongoose.model("Trek", trekSchema);
