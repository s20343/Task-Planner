const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const path = require("path");



const app = express();
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/tasks", taskRoutes);
// Serve frontend files
app.use(express.static(path.join(__dirname, "view")));

app.get("/", (req, res) => {
  res.send("Task Planner API running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
