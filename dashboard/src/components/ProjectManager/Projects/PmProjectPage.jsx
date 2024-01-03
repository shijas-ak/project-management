import React, { useState, useEffect } from "react";
import Select from "react-select";
import { callApi } from "../../../services/API";
import { useNavigate } from "react-router-dom";
import "./PmProjectPage.css";

const PmProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedAssignees, setSelectedAssignees] = useState({});
  const [selectedUnassignees, setSelectedUnassignees] = useState({});
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

    const fetchApprovedUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const approvedUsersData = await callApi(
          "get",
          "users/approved",
          "",
          token
        );

        setApprovedUsers(approvedUsersData.approvedUsers);
      } catch (error) {
        console.error("Error fetching approved users:", error);
      }
    };

    fetchProjects();
    fetchApprovedUsers();
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
      alert("project status updated successfully")
      window.location.reload();
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  const TaskCreationPage = (projectId,userId) => {
    navigate(`/pm-create-task/${projectId}`);
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

  const handleAssignUsers = async (projectId, taskId) => {
    try {
      const token = localStorage.getItem("token");
      const selectedUsers = selectedAssignees[taskId];

      if (!selectedUsers || selectedUsers.length === 0) {
        alert("Please select users to assign.");
        return;
      }
      const userIds = (selectedAssignees[taskId] || []).map(
        (user) => user.value
      );

      const res = await callApi(
        "put",
        `projects/${projectId}/tasks/${taskId}/assign-user`,

        { assignees: userIds },
        token
      );
      alert(res.message);

      const assignedUsersData = await callApi(
        "get",
        `tasks/${taskId}/assigned-users`,
        "",
        token
      );
      setAssignedUsers(assignedUsersData.assignedUsers);
    } catch (error) {
      console.error("Error assigning users to the task:", error.message);
    }
  };

  const handleUnassignUsers = async (projectId, taskId) => {
    try {
      const token = localStorage.getItem("token");
      const selectedUsers = selectedUnassignees[taskId];

      if (!selectedUsers || selectedUsers.length === 0) {
        alert("Please select users to unassign.");
        return;
      }
      const userIds = selectedUsers.map((user) => user.value);
      const res = await callApi(
        "put",
        `projects/${projectId}/tasks/${taskId}/unassign-user`,
        { assignees: userIds },
        token
      );
      alert(res.message);
      window.location.reload();

      const assignedUsersData = await callApi(
        "get",
        `tasks/${taskId}/assigned-users`,
        "",
        token
      );

      setAssignedUsers((prevAssignedUsers) => {
        const updatedAssignedUsers = { ...prevAssignedUsers };
        updatedAssignedUsers[taskId] = assignedUsersData.assignedUsers || [];
        return updatedAssignedUsers;
      });
    } catch (error) {
      console.error("Error unassigning users from the task:", error);
    }
  };

  const handleAssigneesChange = (taskId, values) => {
    setSelectedAssignees((prevAssignees) => ({
      ...prevAssignees,
      [taskId]: values || [],
    }));
  };
  const handleUnassigneesChange = (taskId, values) => {
    setSelectedUnassignees((prevAssignees) => ({
      ...prevAssignees,
      [taskId]: values || [],
    }));
  };

  return (
    <div>
      <h2>TASKS</h2>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project._id}>
            <p>Project: {project.name}</p>
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
            <button onClick={() => TaskCreationPage(project._id)}>
              Add Task
            </button>
            <hr />
            {project.tasks.length > 0 ? (
              project.tasks.map((task) => (
                <div key={task._id}>
                  <p>Task Title: {task.title}</p>
                  <p>Task Status: {task.status}</p>
                  <p>
                    Task Assignees:{" "}
                    {task.assignees
                      .map((assignee) => assignee.username)
                      .join(", ")}
                  </p>

                  <Select
                    options={approvedUsers.map((user) => ({
                      value: user._id,
                      label: user.username,
                    }))}
                    value={selectedAssignees[task._id] || []}
                    isMulti
                    onChange={(values) =>
                      handleAssigneesChange(task._id, values)
                    }
                    placeholder="Select Users to Assign"
                  />

                  <button
                    onClick={() => handleAssignUsers(project._id, task._id)}
                  >
                    Assign Users
                  </button>
                  <Select
                    options={(Array.isArray(assignedUsers)
                      ? assignedUsers
                      : []
                    ).map((user) => ({
                      value: user._id,
                      label: user.username,
                    }))}
                    value={selectedUnassignees[task._id] || []}
                    isMulti
                    onChange={(values) =>
                      handleUnassigneesChange(task._id, values)
                    }
                    placeholder="Select Users to Unassign"
                  />
                  <button
                    onClick={() => handleUnassignUsers(project._id, task._id)}
                  >
                    Unassign Users
                  </button>
                  <button
                    onClick={() => handleDeleteTask(project._id, task._id)}
                  >
                    Delete Task
                  </button>

                  <hr />
                </div>
              ))
            ) : (
              <h4>Please Create tasks</h4>
            )}
          </div>
        ))
      ) : (
        <div>No Projects Available</div>
      )}
    </div>
  );
};

export default PmProjectPage;
