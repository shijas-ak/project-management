import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callApi } from "../../../services/API";

const CreateTask = () => {
  const [projects, setProjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    assignees: [],
  });

  const { projectId } = useParams();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const projectsData = await callApi("get", "projects", "", token);
      setProjects(projectsData.projects);
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
      setSuccessMessage("Task created successfully");
      setErrorMessage("");

      fetchProjects();
      navigate("/pm-dashboard");
    } catch (error) {
      console.error("Error adding task:", error);
      setErrorMessage("Error adding task. Please try again.");
      setSuccessMessage("");
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

export default CreateTask;
