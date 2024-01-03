import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { callApi } from "../../../services/API";
import "./UserTasks.css";

function UserTasks() {
  const [TaskProjectId, setTaskProjectId] = useState();
  const [userTasks, setUserTasks] = useState([]);
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
      alert("task status updated successfully")

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
                <p>Description: {task.description}</p>
                <p>Due Date: {task.endDate}</p>
                <p>Status: {task.status}</p>
                <div className="task-actions">
                  <button
                    onClick={() =>
                      handleTaskStatusChange(task._id, "Completed")
                    }
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() =>
                      handleTaskStatusChange(task._id, "InProgress")
                    }
                  >
                    Mark as InProgress
                  </button>
                  <button
                    onClick={() => handleTaskStatusChange(task._id, "Pending")}
                  >
                    Mark as Pending
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
