const express = require("express");
const router = express.Router();
const controller = require("../controllers/taskController");
const validateObjectId = require("../middlewares/validateObjectId");

// CRUD
router.post("/", controller.createTask);
router.get("/", controller.getTasks);

// SEARCH
router.get("/search", controller.searchTasks);

// AGGREGATIONS
router.get("/stats/projects", controller.tasksPerProject);
router.get("/stats/avg-priority", controller.avgPriorityPerProject);
router.get("/stats/summary", controller.taskSummary);

// CRUD by ID
router.get("/:id", validateObjectId, controller.getTaskById);
router.put("/:id", validateObjectId, controller.updateTask);
router.delete("/:id", validateObjectId, controller.deleteTask);

module.exports = router;
