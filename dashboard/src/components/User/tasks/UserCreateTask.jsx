import React from "react";
import { useState } from "react";
import { callApi } from "../../../services/API";
import { useParams, useNavigate } from "react-router-dom";

const UserCreateTask = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status:""
  });

  const { projectId,userId } = useParams();
  const navigate = useNavigate()

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      await callApi("get", "projects", "", token);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem("token");
     await callApi(
        "post",
        `projects/${projectId}/tasks`,
        { ...taskFormData },
        token
      );
      alert("Task created successfully.");
      navigate(`/user-tasks/${userId}`)
      setErrorMessage("");
      fetchProjects();
    } catch (error) {
      console.error("Error adding task:", error);
      if (error.response && error.response.message === "Task with the same title already exists") {
        alert("Error: Task with the same title already exists. Please choose a different title.");
      } else {
        setErrorMessage("Error adding task. Please try again.");
        setSuccessMessage("");
      }
    }
  };

  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={taskFormData.title}
          onChange={handleTaskFormChange}
        />
        <br />
        <label>Description:</label>
        <textarea
          name="description"
          value={taskFormData.description}
          onChange={handleTaskFormChange}
        />
        <br />
        <label>Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={taskFormData.startDate}
          onChange={handleTaskFormChange}
        />
        <br />
        <label>End Date:</label>
        <input
          type="date"
          name="endDate"
          value={taskFormData.endDate}
          onChange={handleTaskFormChange}
        />

        <br />
        <button type="submit" onClick={handleAddTask}>
          Submit Task
        </button>
      </form>
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </div>
  );
};

export default UserCreateTask;
