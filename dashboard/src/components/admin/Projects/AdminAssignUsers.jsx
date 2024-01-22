import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callApi } from "../../../services/API";

const AdminAssignUsersPage = () => {
    const navigate = useNavigate()
  const { userId,projectId } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

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

    fetchUsers();
  }, []);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const handleAssignUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res =await callApi("put", `assign-users/${projectId}`, { assignees: selectedUsers }, token);
      alert(res.message);
      navigate(`/admin-projects/${userId}`)
    } catch (error) {
      console.error("Error assigning users:", error);
    }
  };

  return (
    <div>
      <h2>Assign Users to Project</h2>
      <form>
        {users.map((user) => (
          <div key={user._id}>
            <label>
              <input
                type="checkbox"
                value={user._id}
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleCheckboxChange(user._id)}
              />
              {user.username}
            </label>
          </div>
        ))}
        <button type="button" onClick={handleAssignUsers}>
          Assign Users
        </button>
      </form>
    </div>
  );
};

export default AdminAssignUsersPage;

