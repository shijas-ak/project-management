import React, { useState, useEffect } from "react";
import { callApi } from "../../../services/API";
import "./PmTasksPage.css";

const PmTasksPage = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUsersByTask, setSelectedUsersByTask] = useState({});
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const projectsData = await callApi("get", "projects", "", token);

      setProjects(projectsData.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const usersData = await callApi("get", "users/approved", "", token);

        setUsers(usersData.approvedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchProjects();
    fetchUsers();
  }, []);

  const handleAssignUser = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await callApi(
        "post",
        `tasks/${taskId}/assign`,
        { userId: selectedUsersByTask[taskId] || [] },
        token
      );

      if (response.message === "User is already assigned to this task") {
        alert("User is already assigned to this task");
        return;
      }

      const updatedAssignedUsersData = await callApi(
        "get",
        `tasks/${taskId}/assigned-users`,
        "",
        token
      );

      setAssignedUsers(updatedAssignedUsersData.assignedUsers);

      setSelectedUsersByTask((prevSelectedUsers) => ({
        ...prevSelectedUsers,
        [taskId]: [],
      }));
    } catch (error) {
      console.error("Error assigning user to task:", error);
    }
  };

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

  const toggleUserSelection = (taskId, userId) => {
    setSelectedUsersByTask((prevSelectedUsers) => ({
      ...prevSelectedUsers,
      [taskId]: prevSelectedUsers[taskId]
        ? prevSelectedUsers[taskId].includes(userId)
          ? prevSelectedUsers[taskId].filter((user) => user !== userId)
          : [...prevSelectedUsers[taskId], userId]
        : [userId],
    }));
  };

  return (
    <div>
      <h2>All Projects and Tasks</h2>
      <div className="container">
        <div className="project-list">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => handleSelectProject(project._id)}
            >
              <p>Name: {project.name}</p>
            </div>
          ))}
        </div>
        <div className="tasks-list">
          {selectedProject ? (
            <div>
              <h3>
                Tasks for {projects.find((p) => p._id === selectedProject).name}
              </h3>
              {tasks.map((task) => (
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
                          .map((assigneeId) => {
                            const user = assignedUsers.find(
                              (user) => user._id === assigneeId
                            );
                            return user ? user.username : "";
                          })
                          .join(", ")
                      : "None"}
                  </p>
                  <div>
                    <label>Choose Users for the task:</label>
                    {users.map((user) => (
                      <div key={user._id}>
                        <input
                          type="checkbox"
                          id={`assignUserCheckbox-${user._id}`}
                          checked={selectedUsersByTask[task._id]?.includes(
                            user._id
                          )}
                          onChange={() =>
                            toggleUserSelection(task._id, user._id)
                          }
                        />
                        <label htmlFor={`assignUserCheckbox-${user._id}`}>
                          {user.username}
                        </label>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        handleAssignUser(task._id, selectedUsersByTask)
                      }
                      disabled={!selectedUsersByTask[task._id]?.length}
                    >
                      Assign User
                    </button>
                  </div>
                </div>
              ))}
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
