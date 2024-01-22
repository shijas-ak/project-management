const mongoose = require("mongoose");
const Project = require("../models/project");

const projectController = {
  getAllProjects: async (req, res) => {
    try {
      const projects = await Project.find().populate({
        path: "assignees",
        model: "User",
        select: "username",
      });
      res.status(200).json({projects});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getProjectsByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;

      const projects = await Project.find({
        assignees : new mongoose.Types.ObjectId(userId),
      }).populate({
        path: "assignees",
        model: "User",
        select: "username",
      });

      if (!projects || projects.length === 0) {
        return res
          .status(404)
          .json({ message: "No projects found for the user" });
      }

      res.status(200).json({ projects, userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getProjectById: async (req, res) => {
    try {
      const projectId = req.params.Id;
      const project = await Project.findById(projectId).populate({
        path:"assignees",
        model:"User",
        select:"username"
      })

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.status(200).json({ project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  createProject: async (req, res) => {
    try {
      const { name, description, startDate, endDate, assignees } = req.body;

      const existingProject = await Project.findOne({ name });

      if (existingProject) {
        console.error("Project with the same name already exists");
        return res
          .status(400)
          .json({ message: "Project with the same name already exists" });
      }

      const newProject = new Project({
        name,
        description,
        startDate,
        endDate,
        assignees,
      });

      await newProject.save();
      await newProject
      .populate({
        path: 'assignees',
        model: "User",
        select: 'username',
      })
      res.status(201).json({
        message: "Project created successfully",
        project: newProject,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateProject: async (req, res) => {
    try {
      const projectId = req.params.Id;
      const { name, description, startDate, endDate, priority, tasks, status, assignees } =
        req.body;
        
      const existingProject = await Project.findOne({
        name,
        _id: { $ne: projectId },
      });

      if (existingProject) {
        console.error("Project with the same name already exists");
        return res
          .status(400)
          .json({ message: "Project with the same name already exists" });
      }

      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { name, description, startDate, endDate, priority, tasks, status, assignees },
        { new: true }
      );

      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.status(200).json({
        message: "Project updated successfully",
        project: updatedProject,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteProject: async (req, res) => {
    try {
      const projectId = req.params.Id;
      const deletedProject = await Project.findByIdAndDelete(projectId);

      if (!deletedProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.status(200).json({
        message: "Project deleted successfully",
        project: deletedProject,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = projectController;
