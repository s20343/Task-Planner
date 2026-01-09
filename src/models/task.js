const mongoose = require("mongoose");
/**
 * Task Schema
 *
 * MongoDB allows flexible documents, meaning not all tasks must contain
 * the same fields. This fits a task planner well:
 *
 * - Work or study tasks may have deadlines, priorities, and projects
 * - Personal tasks may only have a title and category
 *
 * Optional fields avoid rigid schemas and unnecessary migrations.
 */
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

/**
 * INDEXES
 *
 * Indexes improve query performance for common filters and searches.
 */

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