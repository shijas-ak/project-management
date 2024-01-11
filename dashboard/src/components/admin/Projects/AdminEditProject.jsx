import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callApi } from "../../../services/API";

const AdminEditProject = () => {
  const navigate = useNavigate();
  const { userId, projectId } = useParams();
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    description: "",
    priority: "intermediate",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const projectData = await callApi(
          "get",
          `projects/${projectId}`,
          "",
          token
        );
        setProjectDetails({
          name: projectData.name,
          description: projectData.description,
          priority: projectData.priority,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
        });
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await callApi(
        "put",
        `projects/${projectId}`,
        projectDetails,
        token
      );
      if (
        res.status === 200 ||
        res.message === "Project updated successfully"
      ) {
        alert("Project details updated successfully");
      }
      navigate(`/admin-projects/${userId}`);
      if (
        res.status === 400 &&
        res.data.message === "Project with the same name already exists"
      ) {
        alert("Error: Project with the same name already exists");
      }
    } catch (error) {
      console.error("Error updating project details:", error);
    }
  };

  return (
    <div>
      <h2>Edit Project</h2>
      <form>
        <label>
          Project Name:
          <input
            type="text"
            name="name"
            value={projectDetails.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Project Description:
          <textarea
            name="description"
            value={projectDetails.description}
            onChange={handleInputChange}
          />
        </label>
        <label>Project Priority: </label>
        <select
          name="priority"
          value={projectDetails.priority}
          onChange={handleInputChange}
        >
          <option value="high">High</option>
          <option value="intermediate">Intermediate</option>
          <option value="low">Low</option>
        </select>
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={projectDetails.startDate}
            onChange={handleInputChange}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={projectDetails.endDate}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handleSaveProject}>
          Save Project
        </button>
      </form>
    </div>
  );
};

export default AdminEditProject;
