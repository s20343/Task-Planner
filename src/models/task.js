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


// Full-text search index
TaskSchema.index({
  title: "text",
  description: "text",
  project: "text"
});

// Filter & aggregation indexes
TaskSchema.index({ project: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ completed: 1 });
TaskSchema.index({ deadline: 1 });

module.exports = mongoose.model("Task", TaskSchema);