const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController.js');
const authentication = require('../middleware/authentication');


router.post('/projects/:Id/tasks', authentication.verifyTokenForAdminAndPM, taskController.createTask);
router.get('/projects/:Id/tasks', authentication.verifyTokenForAdminAndPM, taskController.getAllTasks);
router.get('/projects/:Id/tasks/:taskId', authentication.verifyToken, taskController.getTaskById);
router.get('/users/:id/tasks', authentication.verifyToken, taskController.getTasksByUserId);
router.put('/projects/:Id/tasks/:taskId', authentication.verifyToken, taskController.updateTaskById);
router.delete('/projects/:Id/tasks/:taskId', authentication.verifyTokenForAdminAndPM, taskController.deleteTask);

module.exports = router;