import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Navigate, useNavigate } from "react-router-dom";
import { LinkedInCallback } from "react-linkedin-login-oauth2";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/ProjectManager/layout/Layout";
import UserLayout from "./components/User/layout/UserLayout.jsx";
import PmDashboard from "./components/ProjectManager/dashboard/PmDashboard.jsx";
import UserDashboard from "./components/User/dashboard/UserDashboard.jsx";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ForgotPasword from "./pages/password-reset/ForgotPasword.jsx";
import VerifyOtp from "./pages/password-reset/Otp-verify.jsx";
import ResetPassword from "./pages/password-reset/ResetPassword.jsx";
import CreateProject from "./components/ProjectManager/Projects/CreateProject.jsx";
import PmProjectsPage from "./components/ProjectManager/Projects/PmProjectsPage.jsx";
import CreateTask from "./components/ProjectManager/Tasks/CreateTask.jsx";
import AdminCreateTask from "./components/admin/Tasks/AdminCreateTask.jsx";
import PmTasksPage from "./components/ProjectManager/Tasks/PmTasksPage.jsx";
import ProfilePage from "./components/ProjectManager/Profile/ProfilePage.jsx";
import UserProfile from "./components/User/profile/UserProfile.jsx";
import UserProjects from "./components/User/projects/UserProjects.jsx";
import UserTasks from "./components/User/tasks/UserTasks.jsx";
import AdminLayout from "./components/admin/layout/AdminLayout.jsx";
import AdminDashboard from "./components/admin/dashboard/AdminDashboard.jsx";
import AdminProjectPage from "./components/admin/Projects/AdminProjectPage.jsx";
import AdminTasksPage from "./components/admin/Tasks/AdminTasksPage.jsx";
import AdminProfilePage from "./components/admin/Profile/AdminProfilePage.jsx";
import UserApproval from "./components/admin/approval/UserApproval.jsx";
import AdminCreateProject from "./components/admin/Projects/AdminCreateProject.jsx";

function App() {
  return (
    <div className="main_container">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/linkedin" Component={LinkedInCallback} />
        <Route path="/forgot-password" element={<ForgotPasword />} />
        <Route
          path="/verify-otp/:userId"
          element={<RequiredAuth child={<VerifyOtp />} />}
        />
        <Route
          path="/reset-password/:userId"
          element={<RequiredAuth child={<ResetPassword />} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin-create-task/:projectId"
          element={<RequiredAuth child={<AdminCreateTask />} />}
        />
        <Route
          path="/pm-create-task/:projectId"
          element={<RequiredAuth child={<CreateTask />} />}
        />

        <Route element={<Layout />}>
          <Route
            path="/pm-dashboard/:userId"
            element={<RequiredAuth child={<PmDashboard />} />}
          />
          <Route
            path="/create-project/:userId"
            element={<RequiredAuth child={<CreateProject />} />}
          />
          <Route
            path="/pm-projects/:userId"
            element={<RequiredAuth child={<PmProjectsPage />} />}
          />
          <Route
            path="/pm-tasks/:userId"
            element={<RequiredAuth child={<PmTasksPage />} />}
          />
          <Route
            path="/pm-profile/:userId"
            element={<RequiredAuth child={<ProfilePage />} />}
          />
        </Route>

        <Route element={<AdminLayout />}>
          <Route
            path="/admin-dashboard/:userId"
            element={<RequiredAuth child={<AdminDashboard />} />}
          />
          <Route
            path="/admin-create-project/:userId"
            element={<RequiredAuth child={<AdminCreateProject />} />}
          />
          <Route
            path="/admin-projects/:userId"
            element={<RequiredAuth child={<AdminProjectPage />} />}
          />
          <Route
            path="/users-approval/:userId"
            element={<RequiredAuth child={<UserApproval />} />}
          />
          <Route
            path="/admin-tasks/:userId"
            element={<RequiredAuth child={<AdminTasksPage />} />}
          />
          <Route
            path="/admin-profile/:userId"
            element={<RequiredAuth child={<AdminProfilePage />} />}
          />
        </Route>

        <Route element={<UserLayout />}>
          <Route
            path="/user-dashboard/:userId"
            element={<RequiredAuth child={<UserDashboard />} />}
          />
          <Route
            path="/user-profile/:userId"
            element={<RequiredAuth child={<UserProfile />} />}
          />
          <Route
            path="/user-tasks/:userId"
            element={<RequiredAuth child={<UserTasks />} />}
          />
          <Route
            path="/user-projects/:userId"
            element={<RequiredAuth child={<UserProjects />} />}
          />
        </Route>
      </Routes>
    </div>
  );
}

const RequiredAuth = ({ child }) => {
  const payload = getTokenPayload();
  const navigate = useNavigate();
  if (payload && payload.exp && payload.exp <= Date.now() / 1000) {
    applyToken(null);
    alert("Sorry your session is expired.Please do login again");
    navigate("/");
    return null;
  }

  if (!getToken()) {
    alert("You are not authorized to access this page.");
    return <Navigate to="/" replace />;
  } else {
    return child;
  }
};
const applyToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    axios.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  } else {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common.Authorization;
  }
};

const getTokenPayload = () => {
  const token = getToken();
  if (!token) return null;

  return jwtDecode(token);
};

const getToken = () => {
  return localStorage.getItem("token");
};

export default App;
