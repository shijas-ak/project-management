const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authentication = require('../middleware/authentication');


router.post('/', authentication.verifyTokenForAdminAndPM, projectController.createProject);
router.get('/', authentication.verifyToken, projectController.getAllProjects);
router.get('/user/:userId', authentication.verifyToken, projectController.getProjectsByUserId);
router.get('/:Id', authentication.verifyToken, projectController.getProjectById);
router.put('/:Id', authentication.verifyTokenForAdminAndPM, projectController.updateProject);
router.delete('/:Id', authentication.verifyTokenForAdminAndPM, projectController.deleteProject);


module.exports = router;