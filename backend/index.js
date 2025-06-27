const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser");
const { mongoose } = require("mongoose");
const { authRoutes } = require("./src/routes/authRoutes");
const { messageRoutes } = require("./src/routes/messageRoutes");
require("dotenv").config()
const fileUpload = require("express-fileupload");
const { app, server } = require("./src/utils/socket");


app.use(cookieParser());
app.use(express.json())
app.use(cors());

app.use(fileUpload({
     useTempFiles: true,
     tempFileDir: "/tmp/", 
}));

app.use(authRoutes)
app.use(messageRoutes)

mongoose.connect(process.env.MONGO_ATLAS)
     .then(() => console.log("MONGO-DB ATLAS CONNECTED"))
server.listen(process.env.PORT, () => {
     console.log("SERVER STARTED ON PORT:", process.env.PORT)
})
