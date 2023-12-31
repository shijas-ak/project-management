import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { callApi } from "../../../services/API";
import "./UserTasks.css";

function UserTasks() {
  const [TaskProjectId, setTaskProjectId] = useState();
  const [userTasks, setUserTasks] = useState([]);
  const [projectName, setProjectname] = useState({});
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await callApi(
          "get",
          `users/${userId}/tasks`,
          "",
          token
        );
        setProjectname(response.projects);
        setTaskProjectId(response.projectId);
        setUserTasks(response.tasks);
      } catch (error) {
        console.error("Error fetching user tasks:", error);
      }
    };
    fetchUserTasks();
  }, [userId]);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const projectId = TaskProjectId;
      await callApi(
        "put",
        `projects/${projectId}/tasks/${taskId}`,
        { status: newStatus },
        token
      );
      alert("task status updated successfully");
      const updatedUserTasks = userTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      setUserTasks(updatedUserTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="user-tasks-container">
      <h2>MY TASKS</h2>
      <div className="tasks-list">
        {userTasks.length > 0 ? (
          <ul>
            {userTasks.map((task) => (
              <li key={task._id} className="task-item">
                <strong>{task.title}</strong>
                <p>
                  Project Name: {projectName.map((name) => name.projectName)}
                </p>
                <p>Task Description: {task.description}</p>
                <p>
                  Task Start Date: {new Date(task.startDate).toDateString()}
                </p>
                <p>Task Due Date: {new Date(task.endDate).toDateString()}</p>
                <p>Status: {task.status}</p>
                <div className="task-actions">
                  <button
                    onClick={() =>
                      handleTaskStatusChange(task._id, "Completed")
                    }
                  >
                    Mark task as Completed
                  </button>
                  <button
                    onClick={() =>
                      handleTaskStatusChange(task._id, "InProgress")
                    }
                  >
                    Mark task as InProgress
                  </button>
                  <button
                    onClick={() => handleTaskStatusChange(task._id, "Pending")}
                  >
                    Mark task as Pending
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no tasks to complete.</p>
        )}
      </div>
    </div>
  );
}

export default UserTasks;
