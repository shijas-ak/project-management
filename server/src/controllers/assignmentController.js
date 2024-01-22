const Project = require("../models/project");
const User = require("../models/user");

const assignmentController = {
  getUserById: async (req, res) => {
    try {
      const loggedInUserId = req.user.id;

      const user = await User.findById(loggedInUserId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteUserById: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.deleteOne();

      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getAllApprovedUsers: async (req, res) => {
    try {
      const approvedUsers = await User.find({
        isApproved: true,
        role: { $nin: ["admin", "PM"] },
      });

      res.status(200).json({
        approvedUsers,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  approveUser: async (req, res) => {
    try {
      const userId = req.params.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isApproved = true;

      await user.save();

      res.status(200).json({
        message: "User approved successfully",
        user: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  unApproveUser: async (req, res) => {
    try {
      const userId = req.params.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isApproved = false;

      await user.save();

      res.status(200).json({
        message: "User unapproved successfully",
        user: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  changeUserRole: async (req, res) => {
    try {
      const userId = req.params.userId;
      const newRole = req.body.role;

      if (!["user", "PM", "admin"].includes(newRole)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = newRole;

      await user.save();

      res.status(200).json({ message: "User role updated successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getAllRegisteredUsers: async (req, res) => {
    try {
      const registeredUsers = await User.find({ role: { $ne: "admin" } });

      res.status(200).json({
        registeredUsers,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getAllAssignedUsersForProject: async (req, res) => {
    try {
      const projectId = req.params.projectId;

      const project = await Project.findById(projectId);

      if (!project) {
        return res
          .status(404)
          .json({ message: "Project not found" });
      }
      const assignedUsers = await User.find({ _id: { $in: project.assignees } });
      res.status(200).json({
        assignedUsers,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
},

assignUserToProject: async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { assignees } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    assignees.forEach((userId) => {
      if (!project.assignees.includes(userId)) {
        project.assignees.push(userId);
      } else {
        console.warn(`User ${userId} is already assigned to the project.`);
      }
    });

    await project.save();

    res.status(200).json({
      message: "User(s) assigned to project successfully",
      project: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
 
},


}

module.exports = assignmentController;
