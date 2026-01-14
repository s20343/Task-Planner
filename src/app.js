const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");


const app = express();
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/tasks", taskRoutes);
// Serve frontend files
app.use(express.static(path.join(__dirname, "view")));
app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("Task Planner API running");
});

// Dashboard page route
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "dashboard.html")); // <- new page
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
