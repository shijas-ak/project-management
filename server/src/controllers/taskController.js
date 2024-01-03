const mongoose = require("mongoose");
const Project = require("../models/project");

const taskController = {
  createTask: async (req, res) => {
    try {
      const projectId = req.params.Id;
      const { title, description, startDate, endDate, assignees } = req.body;

      if (!title) {
        return res.status(400).json({ message: "Task title is required" });
      }

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const taskAssignees = assignees ? [...assignees] : [];

      const newTask = {
        title: title,
        description: description,
        startDate: startDate,
        endDate: endDate,
        status: "pending",
        assignees: taskAssignees,
      };

      project.tasks.push(newTask);
      await project.save();

      res.status(201).json({
        message: "Task created successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getAllTasks: async (req, res) => {
    try {
      const projectId = req.params.Id;
      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const tasks = project.tasks;
      res.status(200).json({ tasks, projectId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getTasksByUserId: async (req, res) => {
    try {
      const userId = req.params.id;

      const projects = await Project.find({
        "tasks.assignees": new mongoose.Types.ObjectId(userId),
      });

      const userTasks = projects.reduce((acc, project) => {
        const tasksForUser = project.tasks.filter((task) =>
          task.assignees.some((assignee) =>
            assignee.equals(new mongoose.Types.ObjectId(userId))
          )
        );
        return [...acc, ...tasksForUser];
      }, []);

      if (!userTasks || userTasks.length === 0) {
        return res
          .status(404)
          .json({ message: "Tasks not found for the user" });
      }

      res.status(200).json({
        userId,
        projectId: projects.map((project) => project._id),
        tasks: userTasks,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getTaskById: async (req, res) => {
    try {
      const projectId = req.params.Id;
      const taskId = req.params.taskId;

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const task = project.tasks.id(taskId);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.status(200).json({ task });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateTaskById: async (req, res) => {
    try {
      const projectId = req.params.Id;
      const taskId = req.params.taskId;

      const { title, description, startDate, endDate, status } = req.body;

      const project = await Project.findOne({
        _id: projectId,
        "tasks._id": taskId,
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const task = project.tasks.id(taskId);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (title !== undefined) {
        task.title = title;
      }
      if (description !== undefined) {
        task.description = description;
      }
      if (startDate !== undefined) {
        task.startDate = startDate;
      }
      if (endDate !== undefined) {
        task.endDate = endDate;
      }
      if (status !== undefined) {
        task.status = status;
      }

      await project.save();

      res.status(200).json({
        message: "Task updated successfully",
        task,
        projectId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const projectId = req.params.Id;
      const taskId = req.params.taskId;

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const task = project.tasks.id(taskId);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      project.tasks.pull({ _id: taskId });
      await project.save();

      res.status(200).json({
        message: "Task deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = taskController;
