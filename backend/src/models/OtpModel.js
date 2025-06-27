const mongoose = require('mongoose');

const otpScheme = new mongoose.Schema({
     email: {
          type: String,
          required: true,
     },
     otp: {
          type: Number,
          required: true,
     },
     createdAt: {
          type: Date,
          default: Date.now,
          expires: 600, // 600 seconds = 10 minutes
     },
})

const otpModel = mongoose.model("otp", otpScheme)
module.exports = { otpModel }