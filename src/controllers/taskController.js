const Task = require("../models/Task");
const taskSchema = require("../validators/taskValidator");

// CREATE
exports.createTask = async (req, res, next) => {
  try {
    const { error, value } = taskSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return next(error);
    }

    const task = await Task.create(value);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

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
exports.updateTask = async (req, res, next) => {
  try {
    const { error, value } = taskSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return next(error);
    }

    // Normalize completed if needed
    if (value.completed !== undefined && typeof value.completed === "string") {
      value.completed = value.completed === "true";
    }

    const task = await Task.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err); // pass all other errors to errorHandler
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
      sortBy = "createdAt", 
      order = "desc", 
    } = req.query;

    let filter = {};

    // Existing filters
    if (category) filter.category = category;
    if (priority) filter.priority = Number(priority);
    if (completed !== undefined) filter.completed = completed === "true";
    if (project) filter.project = project;

    // Deadline filter
    if (deadline) {
      const d = new Date(deadline);
      d.setHours(23, 59, 59, 999); // end of the day
      filter.deadline = { $lte: d }; // tasks with deadline before or on chosen date
    }
    // Dynamic sorting
    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    const tasks = await Task.find(filter).sort(sortOptions);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
