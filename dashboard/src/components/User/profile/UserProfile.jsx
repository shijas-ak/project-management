import React, { useState, useEffect } from "react";
import { callApi, uploadApi } from "../../../services/API";
import "./UserProfile.css";

const Profile = () => {
  const [userId, setUserId] = useState("");
  const [userProfile, setUserProfile] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await callApi(
        "get",
        `users-profile/${userId}`,
        "",
        token
      );
      console.log(response);

      setEditMode(false);
      setUserProfile(response.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await uploadApi(
        "patch",
        `users-profile/${userId}`,
        userProfile,
        token
      );
      console.log(response.message);
      alert("profile updated successfully");

      setEditMode(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  return (
    <div className="container">
      <h1>MY PROFILE</h1>
      {editMode ? (
        <div>
          <label>Firstname:</label>
          <input
            type="text"
            name="firstname"
            value={userProfile.firstname}
            onChange={handleInputChange}
          />
          <label>Lastname:</label>
          <input
            type="text"
            name="lastname"
            value={userProfile.lastname}
            onChange={handleInputChange}
          />
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={userProfile.email}
            onChange={handleInputChange}
          />
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={userProfile.username}
            onChange={handleInputChange}
          />
          <label>About:</label>
          <input
            type="text"
            name="about"
            value={userProfile.others?.about}
            onChange={handleInputChange}
          />
          <label>Company:</label>
          <input
            type="text"
            name="company"
            value={userProfile.others?.company}
            onChange={handleInputChange}
          />
          <label>Job:</label>
          <input
            type="text"
            name="job"
            value={userProfile.others?.job}
            onChange={handleInputChange}
          />
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={userProfile.others?.country}
            onChange={handleInputChange}
          />
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={userProfile.others?.address}
            onChange={handleInputChange}
          />
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={userProfile.others?.phone}
            onChange={handleInputChange}
          />
          <label>Twitter:</label>
          <input
            type="text"
            name="twitter"
            value={userProfile.others?.twitter}
            onChange={handleInputChange}
          />
          <label>Facebook:</label>
          <input
            type="text"
            name="facebook"
            value={userProfile.others?.facebook}
            onChange={handleInputChange}
          />
          <label>Instagram:</label>
          <input
            type="text"
            name="instagram"
            value={userProfile.others?.instagram}
            onChange={handleInputChange}
          />
          <label>Linkedin:</label>
          <input
            type="text"
            name="linkedin"
            value={userProfile.others?.linkedin}
            onChange={handleInputChange}
          />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <div className="profile-section">
          <img
            src={`http://localhost:3000${userProfile.profile_image}`}
            alt="Profile"
            className="profile-image"
          />
          <p>Firstname: {userProfile.firstname}</p>
          <p>Lastname: {userProfile.lastname}</p>
          <p>Email: {userProfile.email}</p>
          <p>Username: {userProfile.username}</p>
          <p>About: {userProfile.others && userProfile.others.about}</p>
          <p>Company: {userProfile.others && userProfile.others.company}</p>
          <p>Job: {userProfile.others && userProfile.others.job}</p>
          <p>Country: {userProfile.others && userProfile.others.country}</p>
          <p>Address: {userProfile.others && userProfile.others.address}</p>
          <p>Phone: {userProfile.others && userProfile.others.phone}</p>
          <p>Twitter: {userProfile.others && userProfile.others.twitter}</p>
          <p>Facebook: {userProfile.others && userProfile.others.facebook}</p>
          <p>Instagram: {userProfile.others && userProfile.others.instagram}</p>
          <p>Linkedin: {userProfile.others && userProfile.others.linkedin}</p>

          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
