const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path")
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const districtRoutes = require("./App/Routes/districtRoutes");
const trekRoutes = require("./App/Routes/trekRoutes");
const slotRoutes = require("./App/Routes/slotRoutes");
const adminAuth = require("./App/Routes/adminAuth");
const messageRoutes = require("./App/Routes/messageRoutes");
const bookingRoutes = require("./App/Routes/bookingRoutes");
const uploadRoutes = require("./App/Routes/uploadRoutes");
const placeRoutes = require("./App/Routes/placeRoutes");
const visitorBlogRoutes = require("./App/Routes/visitorBlogs");
const bookingExportRoute = require("./App/Routes/bookingExportRoute");

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/districts", districtRoutes);
app.use("/api/treks", trekRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/admin", adminAuth);
app.use("/api/messages", messageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/visitor-blogs", visitorBlogRoutes);
app.use("/api/bookings", bookingExportRoute);

// DB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => console.log("Server running",process.env.PORT));
  })
  .catch((err) => console.error(err));
