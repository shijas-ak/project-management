import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callApi } from "../../../services/API";
import "./PmProjectsPage.css";

const PmProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedStatus] = useState("");


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

  const handleStatusChange = async (projectId, selectedStatus) => {
    try {
      const token = localStorage.getItem("token");
      await callApi(
        "put",
        `projects/${projectId}`,
        { status: selectedStatus },
        token
      );
      alert("project status updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating project status:", error);
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
                <p>PROJECT NAME: {project.name} </p>
                <p>PROJECT STATUS: {project.status}</p>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="delete-button"
                >
                  Delete Project
                </button>

                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    handleStatusChange(project._id, e.target.value)
                  }
                >
                  <option value="">Change Project Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="InProgress">InProgress</option>
                </select>
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
              <h2>LIST OF TASKS</h2>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task._id}>
                    <p>Title: {task.title}</p>
                    <p>Description: {task.description}</p>
                    <p>Start Date: {new Date(task.startDate).toDateString()}</p>
                    <p>End Date: {new Date(task.endDate).toDateString()}</p>
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

export default PmProjectsPage;
