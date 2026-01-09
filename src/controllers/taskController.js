const Task = require("../models/Task");

// CREATE
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// (removed duplicate simple getTasks — the file contains a more complete implementation later)

//Task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: "Invalid task ID" });
  }
};

// UPDATE
exports.updateTask = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Normalize completed if it's provided as string
    if (updates.completed !== undefined) {
      if (typeof updates.completed === "string") {
        updates.completed = updates.completed === "true";
      } else {
        updates.completed = Boolean(updates.completed);
      }
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid task ID" });
  }
};

//Task by project
exports.tasksPerProject = async (req, res) => {
  try {
    const result = await Task.aggregate([
      {
        $group: {
          _id: "$project",
          totalTasks: { $sum: 1 },
        },
      },
      {
        $sort: { totalTasks: -1 },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//AVERAGE PRIORITY PER PROJECT
exports.avgPriorityPerProject = async (req, res) => {
  try {
    const result = await Task.aggregate([
      {
        $group: {
          _id: "$project",
          avgPriority: { $avg: "$priority" },
        },
      },
      {
        $project: {
          _id: 1,
          avgPriority: { $round: ["$avgPriority", 2] },
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//OVERALL STATS
exports.taskSummary = async (req, res) => {
  try {
    const result = await Task.aggregate([
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: ["$completed", 1, 0] },
          },
          pendingTasks: {
            $sum: { $cond: ["$completed", 0, 1] },
          },
          avgPriority: { $avg: "$priority" },
        },
      },
      {
        $project: {
          _id: 0,
          totalTasks: 1,
          completedTasks: 1,
          pendingTasks: 1,
          avgPriority: { $round: ["$avgPriority", 2] },
        },
      },
    ]);

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//SEARCH TASKS (text + filters)
exports.searchTasks = async (req, res) => {
  try {
    const { q, category, priority, completed, project } = req.query;

    let filter = {};

    // TEXT SEARCH
    if (q) {
      filter.$text = { $search: q };
    }

    // OPTIONAL FILTERS
    if (category) filter.category = category;
    if (priority) filter.priority = Number(priority);
    if (completed !== undefined) filter.completed = completed === "true";
    if (project) filter.project = project;

    const tasks = await Task.find(
      filter,
      q ? { score: { $meta: "textScore" } } : {}
    ).sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL with filters (including date range)
exports.getTasks = async (req, res) => {
  try {
    const {
      category,
      priority,
      completed,
      project,
      startDate,
      endDate,
      deadline,
    } = req.query;

    let filter = {};

    // Existing filters
    if (category) filter.category = category;
    if (priority) filter.priority = Number(priority);
    if (completed !== undefined) filter.completed = completed === "true";
    if (project) filter.project = project;

    // Created date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Deadline filter
    if (deadline) {
      const d = new Date(deadline);
      d.setHours(23, 59, 59, 999); // end of the day
      filter.deadline = { $lte: d }; // tasks with deadline before or on chosen date
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
