const express = require('express')
const { jwtVerify } = require('../middlewares/jwtVerify')
const { getAllUsers, chatWith, sendMsg } = require('../controllers/messageControllers')

const messageRoutes = express.Router()


messageRoutes.get("/users", jwtVerify, getAllUsers)
messageRoutes.get("/chat-with/:id", jwtVerify, chatWith)
messageRoutes.post("/send-msg-to/:id", jwtVerify, sendMsg)

module.exports = { messageRoutes }