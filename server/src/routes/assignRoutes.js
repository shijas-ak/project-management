const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const authentication = require("../middleware/authentication");

router.get(
  "/users/approved",
  authentication.verifyTokenForAdminAndPM,
  assignmentController.getAllApprovedUsers
);

router.put(
  "/projects/:Id/tasks/:taskId/assign-user",
  authentication.verifyTokenForAdminAndPM,
  assignmentController.assignUserToTask
);

router.get(
  "/users-profile",
  authentication.verifyToken,
  assignmentController.getUserById
);

router.put(
  "/users/approve/:userId",
  authentication.verifyTokenAndAdmin,
  assignmentController.approveUser
);

router.put(
  "/users/unapprove/:userId",
  authentication.verifyTokenAndAdmin,
  assignmentController.unApproveUser
);

router.get(
  "/users/registered",
  authentication.verifyTokenForAdminAndPM,
  assignmentController.getAllRegisteredUsers
);

router.put(
  "/users/:userId/change-role",
  authentication.verifyTokenAndAdmin,
  assignmentController.changeUserRole
);

router.get(
  "/tasks/:taskId/assigned-users",
  authentication.verifyTokenForAdminAndPM,
  assignmentController.getAllAssignedUsersForTask
);
router.delete(
  "/admin/users/:userId",
  authentication.verifyTokenAndAdmin,
  assignmentController.deleteUserById
);

router.put(
  "/projects/:Id/tasks/:taskId/unassign-user",
  authentication.verifyTokenForAdminAndPM,
  assignmentController.unassignUsersFromTask
);

module.exports = router;
