import React, { useState, useEffect } from "react";
import { callApi } from "../../../services/API";
import "./UserApproval.css";

function UserApproval() {
  const [users, setUsers] = useState([]);
  const [usernameFilter, setUsernameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await callApi("get", "users/registered", "", token);
        setUsers(response.registeredUsers);
        if(response.registeredUsers === 0) {
          alert("No registered users are present")
        }
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
      window.confirm("Are you sure you want to remove this user?");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert("You have successfully removed the user");
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
      window.confirm("Are you sure you want to change the role of this user?");
     
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

  const filterUsers = () => {
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(usernameFilter.toLowerCase()) &&
        user.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
        user.role.toLowerCase().includes(roleFilter.toLowerCase())
    );
  };

  return (
    <div>
      <h2>Users</h2>
      <div>
        <label htmlFor="filter">Filter users</label>
        <label>by username:</label>
        <input
          type="text"
          placeholder="Enter the user's username"
          value={usernameFilter}
          onChange={(e) => setUsernameFilter(e.target.value)}
        />
      </div>
      <div>
        <label>by email:</label>
        <input
          type="text"
          placeholder="Enter the user's email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
        />
      </div>
      <div>
        <label>by role:</label>
        <input
          type="text"
          placeholder="Enter the role of the user"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        />
      </div>
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
          {filterUsers().length > 0 ?
          filterUsers().map((user) => (
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
          )):(
            <div><h1>Users are not present</h1></div>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserApproval;
