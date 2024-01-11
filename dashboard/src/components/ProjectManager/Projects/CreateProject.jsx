import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callApi } from "../../../services/API";

const CreateProject = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    priority: "intermediate",
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await callApi("post", "projects", projectData, token);
      alert(resp.message);
      navigate(`/pm-dashboard/${userId}`);
      if (resp.message === "Project with the same name already exists") {
        alert(resp.message);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div>
      <h2>CREATE PROJECT</h2>
      <form>
        <div>
          <label>Project Name:</label>
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={projectData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Priority:</label>
          <select
            name="priority"
            value={projectData.priority}
            onChange={handleInputChange}
          >
            <option value="high">High</option>
            <option value="intermediate">Intermediate</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={projectData.startDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={projectData.endDate}
            onChange={handleInputChange}
          />
        </div>
        <button type="button" onClick={handleCreateProject}>
          Add Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
