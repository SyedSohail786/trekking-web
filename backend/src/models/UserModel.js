const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
     userName: {
          type: String,
          required: true,
     },
     email: {
          type: String,
          required: true,
          unique: true
     },
     profilePic: {
          type: String,
          default: ""
     },
     password: {
          type: String,
          required: true,
          minlength: 8
     },
     lastSeen: {
          type: Date,
          default: null
     }
}, {
     timestamps: true
})

const userModel = mongoose.model("User", userSchema)

module.exports = { userModel }