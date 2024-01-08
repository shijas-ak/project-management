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
  }, [userId]);
  return (
    <div className="user-projects-container">
      <h2>MY PROJECTS</h2>
      <div className="projects-list">
        {userProjects.length > 0 ? (
          userProjects.map((project) => (
            <div key={project._id} className="project-card">
              <h3>Project Title: {project.name}</h3>
              <p className="project-description">
                Project Description: {project.description}
              </p>
              <p>
                Project Start Date: {new Date(project.startDate).toDateString()}
              </p>
              <p>
                Project End Date: {new Date(project.endDate).toDateString()}
              </p>
              <p>Project Current Status: {project.status}</p>
              <p>Number of Tasks: {project.tasks.length}</p>

              <div className="task-list">
                <h4>Tasks List:</h4>
                <ul>
                  {project.tasks.length > 0 ? (
                    project.tasks.map((task) => (
                      <li key={task._id} className="task-item">
                        <strong>{task.title}</strong>
                        <p>
                          Task Start Date:{" "}
                          {new Date(task.startDate).toDateString()}
                        </p>
                        <p>Due Date: {new Date(task.endDate).toDateString()}</p>
                        <p>Status: {task.status}</p>
                        <p>
                          Assignees:{" "}
                          {task.assignees
                            .map((assignee) => assignee.username)
                            .join(", ")}
                        </p>
                      </li>
                    ))
                  ) : (
                    <div>Task List is Empty</div>
                  )}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div>You are not assigned to any Projects</div>
        )}
      </div>
    </div>
  );
}

export default UserProjects;
