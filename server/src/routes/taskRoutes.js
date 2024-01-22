const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController.js");
const authentication = require("../middleware/authentication");

router.post(
  "/projects/:Id/tasks",
  authentication.verifyToken,
  taskController.createTaskForProject
);
router.get(
  "/projects/:Id/tasks",
  authentication.verifyTokenForAdminAndPM,
  taskController.getAllTasks
);

router.get(
  "/users-tasks",
  authentication.verifyTokenForAdminAndPM,
  taskController.getAllUsersWithTasks
);
router.get(
  "/projects/:Id/tasks/:taskId",
  authentication.verifyToken,
  taskController.getTaskById
);
router.get(
  "/projects/:Id/:userId/tasks",
  authentication.verifyToken,
  taskController.getTasksByUserId
);
router.put(
  "/projects/:Id/tasks/:taskId",
  authentication.verifyToken,
  taskController.updateTaskById
);
router.delete(
  "/projects/:Id/tasks/:taskId",
  authentication.verifyToken,
  taskController.deleteTask
);

module.exports = router;
