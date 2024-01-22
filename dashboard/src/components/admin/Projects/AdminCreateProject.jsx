import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callApi } from "../../../services/API";
import "./AdminCreateProject.css"; 

const AdminCreateProject = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    priority: "intermediate",
    startDate: "",
    endDate: "",
    assignees: [],
  });

  const [allApprovedUsers, setAllApprovedUsers] = useState([]);

  useEffect(() => {
    const fetchAllApprovedUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await callApi("get", "users/approved", "", token);
        console.log(response);
        setAllApprovedUsers(response.approvedUsers);
      } catch (error) {
        console.error("Error fetching approved users:", error);
      }
    };

    fetchAllApprovedUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAssigneeChange = (userId) => {
    const isSelected = projectData.assignees.includes(userId);

    if (isSelected) {
      setProjectData((prevData) => ({
        ...prevData,
        assignees: prevData.assignees.filter((id) => id !== userId),
      }));
    } else {
      setProjectData((prevData) => ({
        ...prevData,
        assignees: [...prevData.assignees, userId],
      }));
    }
  };

  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const selectedAssigneeIds = allApprovedUsers
        .filter((user) => projectData.assignees.includes(user._id))
        .map((user) => user._id);
  
      const resp = await callApi("post", "projects", {
        ...projectData,
        assignees: selectedAssigneeIds,
      }, token);
  
      alert(resp.message);
      navigate(`/admin-projects/${userId}`);
      if (resp.message === "Project with the same name already exists") {
        alert(resp.message);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };
  

  return (
    <div>
      <h2>CREATE PROJECT</h2>
      <form>
        <div>
          <label>Project Name:</label>
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={projectData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Priority:</label>
          <select
            name="priority"
            value={projectData.priority}
            onChange={handleInputChange}
          >
            <option value="high">High</option>
            <option value="intermediate">Intermediate</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="assignees-container">
          <label>Assign Users:</label>
          <div className="checkbox-container">
            {allApprovedUsers.map((user) => (
              <div key={user._id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={user._id}
                  checked={projectData.assignees.includes(user._id)}
                  onChange={() => handleAssigneeChange(user._id)}
                />
                <label htmlFor={user._id}>{user.username}</label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={projectData.startDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={projectData.endDate}
            onChange={handleInputChange}
          />
        </div>
        <button type="button" onClick={handleCreateProject}>
          Add Project
        </button>
      </form>
    </div>
  );
};

export default AdminCreateProject;
