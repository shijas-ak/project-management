import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callApi } from "../../../services/API";
import "./PmTasksPage.css";

const PmTasksPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();
  const { userId } = useParams();
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const projectsData = await callApi("get", "projects", "", token);
      if (projectsData.projects.length === 0) {
        alert(
          "No projects are present at the moment.Please go back and create a project."
        );
        navigate(`/pm-dashboard/${userId}`);
      }
      setProjects(projectsData.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSelectProject = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const tasksData = await callApi(
        "get",
        `projects/${projectId}/tasks`,
        "",
        token
      );
      setTasks(tasksData.tasks);
      setSelectedProject(projectId);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await callApi(
          "delete",
          `projects/${projectId}`,
          "",
          token
        );

        if (response.message === "Project deleted successfully") {
          alert("Project deleted successfully");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  return (
    <div>
      <h2>PROJECTS</h2>
      <div className="container">
        <div className="project-list">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                onClick={() => handleSelectProject(project._id)}
              >
                <p>
                  Name: {project.name}{" "}
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="delete-button"
                  >
                    Delete Project
                  </button>
                </p>
              </div>
            ))
          ) : (
            <div>No Projects Available</div>
          )}
        </div>
        <div className="tasks-list">
          {selectedProject ? (
            <div>
              <h3>
                {" "}
                {projects.find((p) => p._id === selectedProject.id)?.name}
              </h3>
              <h2>LIST TASKS</h2>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task._id}>
                    <p>Title: {task.title}</p>
                    <p>Description: {task.description}</p>
                    <p>Start Date: {task.startDate}</p>
                    <p>End Date: {task.endDate}</p>
                    <p>Status: {task.status}</p>
                    <p>
                      Assignees:{" "}
                      {task.assignees && task.assignees.length > 0
                        ? task.assignees
                            .map((assignee) => assignee.username)
                            .join(", ")
                        : "None"}
                    </p>
                  </div>
                ))
              ) : (
                <div>No Tasks available for this Project</div>
              )}
            </div>
          ) : (
            "Select a project!!"
          )}
        </div>
      </div>
    </div>
  );
};

export default PmTasksPage;
