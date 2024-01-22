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
  "/assign-users/:projectId/",
  authentication.verifyTokenForAdminAndPM,
  assignmentController.assignUserToProject
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
  "/projects/:projectId/assigned-users",
  authentication.verifyTokenForAdminAndPM,
  assignmentController.getAllAssignedUsersForProject
);

router.delete(
  "/admin/users/:userId",
  authentication.verifyTokenAndAdmin,
  assignmentController.deleteUserById
);


module.exports = router;
