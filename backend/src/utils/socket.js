const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const { userModel } = require("../models/UserModel")
require("dotenv").config()

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_PATH,
    methods: ["GET", "POST"], // ✅ important
    credentials: true,        // ✅ allows cookies/token if needed
  },
});

const userMap = {};

const getRecieverSocketId = (userId) => {
     return userMap[userId]
}

io.on("connection",  (socket) => {
     const userId = socket.handshake.query.userId;
     if(!userId) console.log("No ID")
     if (userId) userMap[userId] = socket.id;
     

     io.emit("getOnlineUsers", Object.keys(userMap));

     socket.on("disconnect", async() => {
          
          if(userId){
          await userModel.findByIdAndUpdate(userId,{
               lastSeen:new Date()
          })
     }    delete userMap[userId];
          io.emit("getOnlineUsers", Object.keys(userMap));
     })
})

module.exports = { server, io, app, getRecieverSocketId }