import React, { useState, useEffect } from "react";
import { callApi } from "../../../services/API";
import { useParams, useNavigate } from "react-router-dom";
import "./UserTasks.css";

function UserTasks() {
  const [userProjects, setUserProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [projectFilterCriteria, setProjectFilterCriteria] = useState({});
  const [statusByTask, setStatusByTask] = useState({});

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const projectsResponse = await callApi(
          "get",
          `projects/user/${userId}`,
          "",
          token
        );
        setUserProjects(projectsResponse.projects);
        if (selectedProjectId) {
          const tasksResponse = await callApi(
            "get",
            `projects/${selectedProjectId}/${userId}/tasks`,
            "",
            token
          );
          setUserTasks(tasksResponse.tasks);
          const initialStatusByTask = {};
          tasksResponse.tasks.forEach((task) => {
            initialStatusByTask[task._id] = "";
          });
          setStatusByTask(initialStatusByTask);
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId, selectedProjectId]);

  useEffect(() => {
    filterTasks(selectedProjectId);
  }, [userTasks, projectFilterCriteria, selectedProjectId, filterCriteria]);

  const filterTasks = (projectId) => {
    if (!projectId) {
      setFilteredTasks([]);
      return;
    }

    const updatedFilteredTasks = userTasks.filter((task) => {
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
  const handleEditTask = (projectId, taskId) => {
    navigate(`/user-edit-task/${userId}/${projectId}/${taskId}`);
  };

  const isTaskDue = (endDate) => {
    const today = new Date();
    const dueDate = new Date(endDate);
    return dueDate < today;
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await callApi(
        "put",
        `projects/${selectedProjectId}/tasks/${taskId}`,
        { status: newStatus },
        token
      );
      alert("Task status updated successfully");
      window.location.reload()
      setStatusByTask((prevStatusByTask) => ({
        ...prevStatusByTask,
        [taskId]: newStatus,
      }));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const TaskCreationPage = (projectId) => {
    navigate(`/user-create-task/${projectId}/${userId}`);
  };

  const handleDeleteTask = async (projectId, taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await callApi(
          "delete",
          `projects/${projectId}/tasks/${taskId}`,
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

  return (
    <div>
      <h2>MY TASKS</h2>
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
          {userProjects.length > 0 ? (
            userProjects.map((project) => (
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
                      <td>{new Date(task.endDate).toDateString()}</td>
                      <td>{task.status}</td>
                      <td>
                      <select
                          value={statusByTask[task._id]}
                          onChange={(e) =>
                            setStatusByTask((prevStatusByTask) => ({
                              ...prevStatusByTask,
                              [task._id]: e.target.value,
                            }))
                          }
                        >
                          <option value="" disabled>
                            Change Status
                          </option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="InProgress">InProgress</option>
                        </select>
                        <button
                          onClick={() =>
                            handleStatusChange(task._id, statusByTask[task._id])
                          }
                        >
                          Update Status
                        </button>
                        <button onClick={() => handleEditTask(selectedProjectId,task._id)}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteTask(selectedProjectId,task._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <h3>You have no tasks.</h3>
          )}
        </div>
      )}
    </div>
  );
}

export default UserTasks;
