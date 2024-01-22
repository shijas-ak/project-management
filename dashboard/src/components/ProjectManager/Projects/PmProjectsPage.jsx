import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callApi } from "../../../services/API";
import "./PmProjectsPage.css";

const PmProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState("all");

  const navigate = useNavigate();
  const { userId } = useParams();

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const projectsData = await callApi("get", "projects", "", token);
      if (projectsData.projects.length === 0) {
        alert(
          "No projects are present at the moment. Please create a project."
        );
      }

      const formattedProjects = projectsData.projects.map((project) => ({
        ...project,
        assignees:
          project.assignees && project.assignees.length > 0
            ? project.assignees.map((assignee) => assignee.username).join(", ")
            : "None",
      }));

      const sortedProjects = formattedProjects.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setProjects(sortedProjects);
      filterProjects(sortedProjects, filterCriteria);

    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const filterProjects = (projects, criteria) => {
    switch (criteria) {
      case "pending":
        setFilteredProjects(projects.filter((project) => project.status === "Pending"));
        break;
      case "completed":
        setFilteredProjects(projects.filter((project) => project.status === "Completed"));
        break;
      case "alphabetical":
        setFilteredProjects([...projects].sort((a, b) => a.name.localeCompare(b.name)));
        break;
      case "dueDate":
        setFilteredProjects(projects.filter((project) => isProjectDue(project.endDate)));
        break;
      default:
        setFilteredProjects(projects);
        break;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filterCriteria]);
  const handleStatusChange = async (projectId, selectedStatus) => {
    try {
      const token = localStorage.getItem("token");
      await callApi(
        "put",
        `projects/${projectId}`,
        { status: selectedStatus },
        token
      );
      alert("Project status updated successfully");
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

  const handleCreateProject = () => {
    navigate(`/pm-create-project/${userId}`);
  };
  const handleAssignUsers = (projectId) => {
    navigate(`/pm-assign-users/${userId}/${projectId}`);
  };
  const isProjectDue = (endDate) => {
    const today = new Date();
    const dueDate = new Date(endDate);
    return dueDate < today;
  };

  return (
    <div>
      <h2>PROJECTS</h2>
      <button className="create-project-button" onClick={handleCreateProject}>
        Create Project
      </button>
      <label>Filter by:</label>
      <select
        value={filterCriteria}
        onChange={(e) => setFilterCriteria(e.target.value)}
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="alphabetical">Alphabetical Order</option>
        <option value="dueDate">By Due Date</option>
      </select>

      <table className="projects-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>End Date</th>
            <th>Assignees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <tr
                key={project._id}
                style={{
                  backgroundColor: isProjectDue(project.endDate)
                    ? "#ffcccc"
                    : "inherit",
                }}
              >
                {" "}
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{project.priority}</td>
                <td>{project.status}</td>
                <td>{new Date(project.endDate).toDateString()}</td>
                <td>{project.assignees}</td>
                <td>
                <button
                    onClick={() => handleAssignUsers(project._id)}
                    className="assign-users-button"
                  >
                    Assign Users
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/pm-edit-project/${userId}/${project._id}`)
                    }
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      handleStatusChange(project._id, e.target.value)
                    }
                  >
                    <option value="">Change Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="InProgress">InProgress</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No Projects Available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default PmProjectsPage;
