import { useRef, useEffect, useState } from "react";
import style from "./header.module.css";
import { Link, useParams } from "react-router-dom";
import { callApi } from "../../../services/API";
import { logout } from "../../../pages/logout";

export default function PageHeader({ showMobileMenu }) {
  const { userId } = useParams();
  const [openProfile, setOpenProfile] = useState(false);
  const [showMobTopbar, setshowMobTopbar] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: "",
    email: "",
    profile_image: "",
  });
  const [users] = useState([]);

  let toggleRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await callApi("get", "users-profile", "", token);
        const userData = response.user;

        setUserProfile({
          username: userData.username,
          email: userData.email,
          profile_image: userData.profile_image,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toggleRef.current && !toggleRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfile]);

  return (
    <div className="header">
      <div className="top_bar_left">
        <div className={style.mobile_menu_btn} onClick={() => showMobileMenu()}>
          <span className="icon-menu"></span>
        </div>
      </div>
      <div className="top_bar_right">
        <ul
          className={
            showMobTopbar ? "top_bar_right_list show" : "top_bar_right_list"
          }
        >
          <li
            className="profile_top_details"
            onClick={() => setOpenProfile(!openProfile)}
          >
            <div className="profile_avatar">
              <img
                src={`http://localhost:3000${userProfile.profile_image}`}
                alt="dp"
                width="42px"
              />
            </div>
            <div className="profile_info">
              <h5>{userProfile.username}</h5>
              <p>{userProfile.email}</p>
            </div>
            <div className="profile_toggle_btn">
              <span className="icon-drop_arrow"></span>
            </div>
          </li>
        </ul>
        <div
          className={style.mobile_topbar_menu}
          onClick={() => setshowMobTopbar(!showMobTopbar)}
        >
          <span className="icon-three_dots"></span>
        </div>
      </div>
      <div
        className={openProfile ? "profile_top show" : "profile_top"}
        ref={toggleRef}
      >
        <button className="profile_close" onClick={() => setOpenProfile(false)}>
          ×
        </button>
        <ul className="profile_popup">
          {users.map((user) => (
            <li key={user._id}>
              <div className="profile_pic">
                <img
                  src={`http://localhost:3000/${user.profile_image}`}
                  alt="dp"
                />
              </div>
              <h6>{user.username}</h6>
              <p>{user.email}</p>
            </li>
          ))}
          <li className="view_profile">
            <Link to={`/pm-profile/${userId}`}>View my profile</Link>
          </li>

          <li>
            <button className="main_button" onClick={logout}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
