const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authentication = require('../middleware/authentication');


router.post('/projects', authentication.verifyTokenForAdminAndPM, projectController.createProject);
router.get('/projects', authentication.verifyToken, projectController.getAllProjects);
router.get('/projects/user/:userId', authentication.verifyToken, projectController.getProjectsByUserId);
router.get('/projects/:Id', authentication.verifyToken, projectController.getProjectById);
router.put('/projects/:Id', authentication.verifyTokenForAdminAndPM, projectController.updateProject);
router.delete('/projects/:Id', authentication.verifyTokenForAdminAndPM, projectController.deleteProject);


module.exports = router;