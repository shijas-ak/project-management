import React, { useState, useEffect } from "react";
import { callApi } from "../../../services/API";
import { useNavigate } from "react-router-dom";

const PmProjectPage = () => {
  const [projects, setProjects] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const projectsData = await callApi("get", "projects", "", token);
        setProjects(projectsData.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleStatusChange = async (projectId, selectedStatus) => {
    try {
      const token = localStorage.getItem("token");
      await callApi(
        "put",
        `projects/${projectId}`,
        { status: selectedStatus },
        token

      );
      window.location.reload()
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  
  const TaskCreationPage = (projectId) => {
    console.log(projectId);
    navigate(`/create-task/${projectId}`);
  };

  return (
    <div>
      <h2>All Projects</h2>
      {projects.map((project) => (
        <div key={project._id}>
          <p>Name: {project.name}</p>
          <p>Status: {project.status}</p>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(project._id, e.target.value)}
          >
            <option value="">Change Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="InProgress">InProgress</option>
          </select>
          <button onClick={()=>TaskCreationPage(project._id)}>Add Task</button>

          <hr />
        </div>
      ))}
    </div>
  );
};

export default PmProjectPage;
