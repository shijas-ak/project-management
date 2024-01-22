import React, { useState, useEffect } from "react";
import { callApi } from "../../../services/API";
import { useNavigate, useParams } from "react-router-dom";
import "./AdminTasksPage.css";

const AdminTasksPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [projectFilterCriteria, setProjectFilterCriteria] = useState({});
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await callApi("get", "projects", "", token);
        if (res.projects.length === 0) {
          alert("No Projects are present");
        }
        setProjects(res.projects);

        const initialFilterCriteria = {};
        res.projects.forEach((project) => {
          initialFilterCriteria[project._id] = "all";
        });
        setProjectFilterCriteria(initialFilterCriteria);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [navigate, userId]);

  useEffect(() => {
    filterTasks(selectedProjectId);
  }, [projectFilterCriteria, selectedProjectId, filterCriteria]);

  const filterTasks = (projectId) => {
    if (!projectId) {
      setFilteredTasks([]);
      return;
    }

    const project = projects.find((project) => project._id === projectId);

    if (!project) {
      setFilteredTasks([]);
      return;
    }

    const updatedFilteredTasks = project.tasks.filter((task) => {
      switch (projectFilterCriteria[projectId]) {
        case "pending":
          return task.status === "Pending";
        case "completed":
          return task.status === "Completed";
        case "alphabetical":
          return true;
        case "dueDate":
          return isTaskDue(task.endDate);
        default:
          return true;
      }
    });
    if (projectFilterCriteria[projectId] === "alphabetical") {
      updatedFilteredTasks.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredTasks(updatedFilteredTasks);
  };

  const TaskCreationPage = (projectId) => {
    setSelectedProjectId(projectId);
    navigate(`/pm-create-task/${projectId}/${userId}`);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await callApi(
          "delete",
          `projects/${selectedProjectId}/tasks/${taskId}`,
          "",
          token
        );
        alert(res.message);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting task:", error.message);
      }
    }
  };

  const handleEditTask = (taskId) => {
    navigate(`/pm-edit-task/${userId}/${selectedProjectId}/${taskId}`);
  };

  const isTaskDue = (endDate) => {
    const today = new Date();
    const dueDate = new Date(endDate);
    return dueDate < today;
  };

  return (
    <div>
      <h2>TASKS</h2>
      <div>
        <label>Select Project:</label>
        <select
          value={selectedProjectId}
          onChange={(e) => {
            setSelectedProjectId(e.target.value);
            filterTasks(e.target.value);
          }}
        >
          <option value="" disabled>
            Select a Project
          </option>
          {projects.length > 0 ? (
            projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))
          ) : (
            <p>no projects available</p>
          )}
        </select>
      </div>

      {selectedProjectId && (
        <div>
          <button onClick={() => TaskCreationPage(selectedProjectId)}>
            Add Task
          </button>
          <label>Filter by:</label>
          <select
            value={projectFilterCriteria[selectedProjectId]}
            onChange={(e) => {
              const updatedFilterCriteria = {
                ...projectFilterCriteria,
                [selectedProjectId]: e.target.value,
              };
              setProjectFilterCriteria(updatedFilterCriteria);
              filterTasks(selectedProjectId);
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="alphabetical">Alphabetical Order</option>
            <option value="dueDate">By Due Date</option>
          </select>
          <hr />
          {filteredTasks.length > 0 ? (
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .map((task) => (
                    <tr
                      key={task._id}
                      style={{
                        backgroundColor: isTaskDue(task.endDate)
                          ? "#ffcccc"
                          : "inherit",
                      }}
                    >
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>{new Date(task.endDate).toDateString()}</td>
                      <td>{task.status}</td>
                      <td>
                        <button onClick={() => handleEditTask(task._id)}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteTask(task._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <h4>No tasks present for the selected project !!!</h4>
          )}
        </div>
      )}
    </div>
  );
};


export default AdminTasksPage;
