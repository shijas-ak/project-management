import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { callApi } from "../../../services/API";
import "./UserProjects.css";

function UserProjects() {
  const [userProjects, setUserProjects] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await callApi(
          "get",
          `projects/user/${userId}`,
          "",
          token
        );
        setUserProjects(response.projects);
      } catch (error) {
        console.error("Error fetching user projects:", error);
      }
    };

    fetchUserProjects();
  }, []);
  return (
    <div className="user-projects-container">
      <h2>User Projects</h2>
      <div className="projects-list">
        {userProjects.map((project) => (
          <div key={project._id} className="project-card">
            <h3>{project.name}</h3>
            <p className="project-description">
              Description: {project.description}
            </p>
            <p>Start Date: {project.startDate}</p>
            <p>End Date: {project.endDate}</p>
            <p>Status: {project.status}</p>
            <p>Tasks Assigned: {project.tasks.length}</p>

            <div className="task-list">
              <h4>Tasks:</h4>
              <ul>
                {project.tasks.map((task) => (
                  <li key={task._id} className="task-item">
                    <strong>{task.title}</strong>
                    <p>Due Date: {task.endDate}</p>
                    <p>Status: {task.status}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProjects;
