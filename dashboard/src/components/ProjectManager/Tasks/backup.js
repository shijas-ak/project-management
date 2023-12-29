const handleAssigneesChange = (selectedAssignees) => {
  setTaskFormData((prevData) => ({
    ...prevData,
    assignees: selectedAssignees,
  }));
};

<br />
<label>Assignees:</label>
<ul className="checkbox-list">
  {users.map((user) => (
    <li key={user._id} className="checkbox-list-item">
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="assignees"
          value={user._id}
          checked={taskFormData.assignees.includes(user._id)}
          onChange={() =>
            handleAssigneesChange(
              taskFormData.assignees.includes(user._id)
                ? taskFormData.assignees.filter((id) => id !== user._id)
                : [...taskFormData.assignees, user._id]
            )
          }
        />
        {user.username}
      </label>
    </li>
  ))}
</ul>
