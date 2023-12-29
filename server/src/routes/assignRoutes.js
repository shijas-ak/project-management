const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const authentication = require("../middleware/authentication");


router.get(
  "/users/approved",
  authentication.verifyTokenForAdminAndPM,
  assignmentController.getAllApprovedUsers
);

router.get(
  "/users-profile",
  authentication.verifyToken,
  assignmentController.getUserById
);

router.post(
  "/tasks/:taskId/assign",
  authentication.verifyTokenForAdminAndPM,
  assignmentController.assignUserToTask
);

router.put(
  '/users/approve/:userId',
  authentication.verifyTokenAndAdmin,
  assignmentController.approveUser
);

router.put(
  '/users/unapprove/:userId',
  authentication.verifyTokenAndAdmin,
  assignmentController.unApproveUser
);



router.get(
  '/users/registered',
  authentication.verifyTokenForAdminAndPM,
  assignmentController.getAllRegisteredUsers
);

router.put(
  '/users/:userId/change-role',
  authentication.verifyTokenAndAdmin,
  assignmentController.changeUserRole
);


router.get(
  "/tasks/:taskId/assigned-users",
  authentication.verifyTokenForAdminAndPM,
  assignmentController.getAllAssignedUsersForTask
);
router.delete('/admin/users/:userId', authentication.verifyTokenAndAdmin, assignmentController.deleteUserById);

router.post(
  "/projects/:Id/tasks/:taskId/unassign",
  authentication.verifyTokenForAdminAndPM,
  assignmentController.unassignUserFromTask
);

module.exports = router;
