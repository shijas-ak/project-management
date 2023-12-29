const mongoose = require('mongoose')
const Project = require("../models/project");

const projectController = {
  getAllProjects: async (req, res) => {
    try {
      const projects = await Project.find();
      res.status(200).json({ projects });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getProjectsByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const projects = await Project.find({ 'tasks.assignees': new mongoose.Types.ObjectId(userId) });
  
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: "No projects found for the user" });
      }
  
      res.status(200).json({ projects,userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getProjectById: async (req, res) => {
    try {
      const projectId = req.params.Id;
      const project = await Project.findById(projectId);

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
      const { name, description, startDate, endDate } = req.body;

      const newProject = new Project({
        name,
        description,
        startDate,
        endDate,
      });

      await newProject.save();

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
      const { name, priority, tasks ,status} = req.body;

      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { name, priority, tasks,status },
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
