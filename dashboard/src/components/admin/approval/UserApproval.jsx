import React, { useState, useEffect } from "react";
import { callApi } from "../../../services/API";
import "./UserApproval.css";

function UserApproval() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await callApi("get", "users/registered", "", token);
        setUsers(response.registeredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleRemoveUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await callApi("delete", `admin/users/${userId}`, "", token);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      await callApi(
        "put",
        `users/${userId}/change-role`,
        { role: newRole },
        token
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error changing user role:", error);
    }
  };

  const handleApprovalToggle = async (userId, isApproved) => {
    try {
      const token = localStorage.getItem("token");
      const route = isApproved
        ? `users/unapprove/${userId}`
        : `users/approve/${userId}`;

      await callApi("put", route, {}, token);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isApproved: !isApproved } : user
        )
      );
    } catch (error) {
      console.error("Error toggling user approval:", error);
    }
  };

  return (
    <div>
      <h2>User Approval</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <input
                  type="checkbox"
                  checked={user.isApproved}
                  onChange={() =>
                    handleApprovalToggle(user._id, user.isApproved)
                  }
                />
              </td>
              <td>
                <button onClick={() => handleRemoveUser(user._id)}>
                  Remove
                </button>

                <button
                  onClick={() =>
                    handleApprovalToggle(user._id, user.isApproved)
                  }
                >
                  {user.isApproved ? "Disapprove" : "Approve"}
                </button>

                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="PM">Project Manager</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserApproval;
