const express = require("express");
const router = express.Router();
const controller = require("../controllers/TaskController");

// CRUD
router.post("/", controller.createTask);
router.get("/", controller.getTasks);

// SEARCH
router.get("/search", controller.searchTasks);

// AGGREGATIONS
router.get("/stats/projects", controller.tasksPerProject);
router.get("/stats/avg-priority", controller.avgPriorityPerProject);
router.get("/stats/summary", controller.taskSummary);

// CRUD by ID (last - keep param routes at the end)
router.get("/:id", controller.getTaskById);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;
