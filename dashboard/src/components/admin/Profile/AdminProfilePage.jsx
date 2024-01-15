import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { callApi, uploadApi } from "../../../services/API";
import "./AdminProfilePage.css";

const AdminProfilePage = () => {
  const {userId} =useParams()
  const [userProfile, setUserProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState(null);


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

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (file) {
        const formData = new FormData();
        formData.append("profile_image", file);
        const update = await uploadApi(
          "patch",
          `users-profile/${userId}`,
          formData,
          token
        );
        setEditMode(false);

        console.log(update);
        alert("Profile Picture Uploaded Successfully");
      }
      await callApi("patch", `users-profile/${userId}`, userProfile, token);

      alert("Your Profile updated successfully");
      setEditMode(false);
      window.location.reload();
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
   
  };

  return (
    <div className="container">
      <h1>MY PROFILE</h1>
      {editMode ? (
        <div>
          <div>
            <img
              src={`https://project-tracker-737o.onrender.com${userProfile.profile_image}`}
              alt="Profile"
              className="profile-image"
            />
            <label>Profile Image:</label>
            <input
              type="file"
              name="profile_image"
              onChange={handleFileChange}
            />
            <button onClick={handleSaveClick}>Upload image</button>
          </div>
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
            value={userProfile.about}
            onChange={handleInputChange}
          />
          <label>Company:</label>
          <input
            type="text"
            name="company"
            value={userProfile.company}
            onChange={handleInputChange}
          />
          <label>Job:</label>
          <input
            type="text"
            name="job"
            value={userProfile.job}
            onChange={handleInputChange}
          />
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={userProfile.country}
            onChange={handleInputChange}
          />
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={userProfile.address}
            onChange={handleInputChange}
          />
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={userProfile.phone}
            onChange={handleInputChange}
          />
          <label>Twitter:</label>
          <input
            type="text"
            name="twitter"
            value={userProfile.twitter}
            onChange={handleInputChange}
          />
          <label>Facebook:</label>
          <input
            type="text"
            name="facebook"
            value={userProfile.facebook}
            onChange={handleInputChange}
          />
          <label>Instagram:</label>
          <input
            type="text"
            name="instagram"
            value={userProfile.instagram}
            onChange={handleInputChange}
          />
          <label>Linkedin:</label>
          <input
            type="text"
            name="linkedin"
            value={userProfile.linkedin}
            onChange={handleInputChange}
          />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <div className="profile-section">
          <img
            src={`https://project-tracker-737o.onrender.com${userProfile.profile_image}`}
            alt="Profile"
            className="profile-image"
          />
          <p>Firstname: {userProfile.firstname}</p>
          <p>Lastname: {userProfile.lastname}</p>
          <p>Email: {userProfile.email}</p>
          <p>Username: {userProfile.username}</p>
          <p>About: {userProfile.about}</p>
          <p>Company: {userProfile.company}</p>
          <p>Job: {userProfile.job}</p>
          <p>Country: {userProfile.country}</p>
          <p>Address: {userProfile.address}</p>
          <p>Phone: {userProfile.phone}</p>
          <p>Twitter: {userProfile.twitter}</p>
          <p>Facebook: {userProfile.facebook}</p>
          <p>Instagram: {userProfile.instagram}</p>
          <p>Linkedin: {userProfile.linkedin}</p>

          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </div>
  );
};
export default AdminProfilePage;
