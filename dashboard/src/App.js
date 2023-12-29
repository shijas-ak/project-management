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
import CreateProject from "./pages/projects/CreateProject.jsx";
import PmProjectPage from "./components/ProjectManager/Projects/PmProjectPage.jsx";
import CreateTask from "./components/ProjectManager/Tasks/CreateTask.jsx";
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
import { UserIdProvider } from "./services/UserIdProvider.jsx";

function App() {
  return (
    <div className="main_container">
       <UserIdProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasword />} />
        <Route path="/verify-otp/:userId" element={<VerifyOtp />} />
        <Route path="/reset-password/:userId" element={<ResetPassword />} />

        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/pm-dashboard/:userId" element={<PmDashboard />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/pm-projects/:userId" element={<PmProjectPage />} />
          <Route path="/create-task/:projectId" element={<CreateTask />} />
          <Route path="/pm-tasks/:userId" element={<PmTasksPage />} />
          <Route path="/pm-profile/:userId" element={<ProfilePage />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard/:userId" element={<AdminDashboard />} />
          <Route
            path="/admin-projects/:userId"
            element={<AdminProjectPage />}
          />
          <Route path="/users-approval/:userId" element={<UserApproval />} />
          <Route path="/admin-tasks/:userId" element={<AdminTasksPage />} />
          <Route path="/admin-profile/:userId" element={<AdminProfilePage />} />
        </Route>
        <Route element={<UserLayout />}>
          <Route path="/user-dashboard/:userId" element={<UserDashboard />} />
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/user-tasks/:userId" element={<UserTasks />} />
          <Route path="/user-projects/:userId" element={<UserProjects />} />
        </Route>
      </Routes>
      </UserIdProvider>
    </div>
  );
}

export default App;
