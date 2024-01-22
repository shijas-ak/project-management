const mongoose = require("mongoose");
const Project = require("../models/project");
const User = require("../models/user");

const taskController = {
  createTaskForProject: async (req, res) => {
    try {
      const projectId = req.params.Id;
      const { title, description, startDate, endDate } = req.body;

      if (!title) {
        return res.status(400).json({ message: "Task title is required" });
      }

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      const user = req.user;

      if (
        !(
          user.role === "admin" ||
          user.role === "PM" ||
          project.assignees.includes(user._id)
        )
      ) {
        return res.status(403).json({
          message: "You are not authorized to create tasks for this project",
        });
      }
      const existingTask = project.tasks.find((task) => task.title === title);
      if (existingTask) {
        return res
          .status(400)
          .json({ message: "Task with the same title already exists" });
      }

      const newTask = {
        title: title,
        description: description,
        startDate: startDate,
        endDate: endDate,
        status: "Pending",
        createdBy: user._id,
      };

      project.tasks.push(newTask);
      await project.save();
      const updatedProject = await Project.findById(projectId).populate([
        {
          path: "assignees",
          model: "User",
          select: "username",
        },
        {
          path: "tasks.createdBy",
          model: "User",
          select: "username",
        },
      ]);

      res.status(201).json({
        message: "Task created successfully",
        project: updatedProject,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getTaskById: async (req,res) => {
    try {
      const projectId = req.params.Id;
      const taskId = req.params.taskId;
  
      const project = await Project.findById(projectId).populate({
        path: 'tasks.createdBy',
        model: 'User',
        select: 'username',
      });
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      const task = project.tasks.find((task) => task._id.toString() === taskId);
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      const userTask = {
        ...task.toObject(),
        projectName: project.name,
      };
  
      res.status(200).json({
        taskId,
        task: userTask,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  getAllTasks: async (req, res) => {
    try {
      const projectId = req.params.Id;
      const project = await Project.findById(projectId).populate({
        path: "tasks.createdBy",
        model: "User",
        select: "username",
      });
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

  getAllUsersWithTasks : async(req,res) => {
    try {
      
      const users = await User.find();
      const usersWithTasks = [];
  
      for (const user of users) {
        const userTasks = await Project.aggregate([
          {
            $match: {
              'assignees': user._id,
            },
          },
          {
            $unwind: '$tasks',
          },
          {
            $match: {
              'tasks.createdBy': user._id,
            },
          },
          {
            $project: {
              _id: 0,
              userId: '$tasks.createdBy',
              username: user.username,
              task: '$tasks',
            },
          },
        ]);
  
        usersWithTasks.push(...userTasks);
      }
  
      res.status(200).json({
        usersWithTasks,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getTasksByUserId: async (req, res) => {
    try {
      const projectId = req.params.Id;
      const userId = req.params.userId;

      const project = await Project.findById(projectId).populate({
        path: "tasks.createdBy",
        model: "User",
        select: "username",
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const userTasks = project.tasks
        .filter(
          (task) =>
            project.assignees.some(
              (assignee) => assignee._id.toString() === userId
            ) &&
            task.createdBy &&
            task.createdBy._id.toString() === userId
        )
        .map((task) => ({
          ...task.toObject(),
          projectName: project.name,
        }));

      if (!userTasks || userTasks.length === 0) {
        return res
          .status(404)
          .json({ message: "Tasks not found for the user" });
      }

      res.status(200).json({
        userId,
        tasks: userTasks,
      });
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
