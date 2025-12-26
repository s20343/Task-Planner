const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,

    category: {
      type: String,
      enum: ["work", "personal", "study", "other"],
      default: "other"
    },

    priority: {
      type: Number,
      min: 1,
      max: 5
    },

    deadline: Date,

    project: String,

    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/* 🔍 TEXT SEARCH INDEX — PASTE HERE */
TaskSchema.index({
  title: "text",
  description: "text",
  project: "text"
});

module.exports = mongoose.model("Task", TaskSchema);