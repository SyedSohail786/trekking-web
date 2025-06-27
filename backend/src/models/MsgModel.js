const mongoose = require("mongoose")

const msgSchema = new mongoose.Schema({
     senderId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User"
     },
     receiverId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User"
     },
     text: {
          type: String,
     },
     image: {
          type: String,
     }
}, {
     timestamps: true
})

const msgModel = mongoose.model("Message", msgSchema)

module.exports = { msgModel }