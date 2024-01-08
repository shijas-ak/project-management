import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { callApi } from "../../../services/API";

const AdminEditTask = () => {
  const navigate = useNavigate();
  const { userId, projectId, taskId } = useParams();
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Pending",
  });

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const taskData = await callApi(
          "get",
          `projects/${projectId}/tasks/${taskId}`,
          "",
          token
        );
        setTaskDetails({
          title: taskData.title,
          description: taskData.description,
          startDate: taskData.startDate,
          endDate: taskData.endDate,
          status: taskData.status,
        });
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    fetchTaskDetails();
  }, [projectId, taskId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveTask = async () => {
    try {
      const token = localStorage.getItem("token");
      await callApi(
        "put",
        `projects/${projectId}/tasks/${taskId}`,
        taskDetails,
        token
      );
      alert("Task details updated successfully");
      navigate(`/admin-tasks/${userId}`);
    } catch (error) {
      console.error("Error updating task details:", error);
    }
  };

  return (
    <div>
      <h2>Edit Task</h2>
      <form>
        <label>
          Task Title:
          <input
            type="text"
            name="title"
            value={taskDetails.title}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Task Description:
          <textarea
            name="description"
            value={taskDetails.description}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={taskDetails.startDate}
            onChange={handleInputChange}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={taskDetails.endDate}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Status:
          <select
            name="status"
            value={taskDetails.status}
            onChange={handleInputChange}
          >
            <option value="Pending">Pending</option>
            <option value="InProgress">InProgress</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
        <button type="button" onClick={handleSaveTask}>
          Save Task
        </button>
      </form>
    </div>
  );
};

export default AdminEditTask;
