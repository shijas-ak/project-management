import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { callApi } from "../../../services/API";
import "./UserProjects.css";

function UserProjects() {
  const [userProjects, setUserProjects] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
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
        const sortedProjects = response.projects.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setUserProjects(sortedProjects);
           const tasksPromises = response.projects.map(async (project) => {
            const tasksResponse = await callApi(
              "get",
              `projects/${project._id}/${userId}/tasks`,
              "",
              token
            );
            return {
              projectId: project._id,
              tasks: tasksResponse.tasks,
            };
          });
  
          const tasksResults = await Promise.all(tasksPromises);
          const tasksMap = {};
          tasksResults.forEach((result) => {
            tasksMap[result.projectId] = result.tasks;
          });
          setUserTasks(tasksMap);
        } catch (error) {
          console.error("Error fetching user projects:", error);
        }
      };
  
      fetchUserProjects();
    }, [userId]);

  return (
    <div className="user-projects-container">
      <h2>MY PROJECTS</h2>
      {userProjects.length > 0 ? (
        <table className="projects-table">
          <thead>
            <tr>
              <th>Project Title</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Current Status</th>
              <th>Your Tasks</th>
            </tr>
          </thead>
          <tbody>
            {userProjects.map((project) => (
              <tr key={project._id}>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{new Date(project.startDate).toDateString()}</td>
                <td>{new Date(project.endDate).toDateString()}</td>
                <td>{project.status}</td>
                <td>{userTasks[project._id]?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h3>You are not assigned to any Projects</h3>
      )}
    </div>
  );
}

export default UserProjects;
