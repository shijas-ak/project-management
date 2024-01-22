import "chart.js/auto";
import AdminDashboardCard from "./AdminDashboardCard";
import { Bar } from "react-chartjs-2";
import style from "./page.module.css";
import { callApi } from "../../../services/API";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [projectStats, setProjectStats] = useState({
    totalProjects: 0,
    finishedProjects: 0,
    pendingProjects: 0,
  });
  const [approvedUsersCount, setApprovedUsersCount] = useState(0);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjectStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const projects = await callApi("get", "projects", "", token);

        const totalProjects = projects.projects.length;
        const finishedProjects = projects.projects.filter(
          (project) => project.status === "Completed"
        ).length;
        const pendingProjects = projects.projects.filter(
          (project) => project.status === "Pending"
        ).length;

        setProjectStats({
          totalProjects,
          finishedProjects,
          pendingProjects,
        });
        setProjects(projects.projects);
      } catch (error) {
        console.error("Error fetching project stats:", error);
      }
    };

    const fetchApprovedUsersCount = async () => {
      try {
        const token = localStorage.getItem("token");

        const approvedUsers = await callApi("get", "users/approved", "", token);
        setApprovedUsersCount(approvedUsers.approvedUsers.length);
        if (approvedUsers.approvedUsers.length === 0) {
          alert("Approved users are not present");
        }
      } catch (error) {
        console.error("Error fetching approved users count:", error);
      }
    };

    fetchProjectStats();
    fetchApprovedUsersCount();
  }, []);

  const chartData = {
    labels: ["Completed Projects", "Pending Projects"],
    datasets: [
      {
        label: "Project Growth",
        data: [projectStats.finishedProjects, projectStats.pendingProjects],
        backgroundColor: ["green", "lightblue"],
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        type: "category",
      },
    },
  };

  return (
    <div className={style.dashboard_outer}>
      <div className={style.dashboard_wrapper}>
        <div className={style.dashboard_top}>
          <div className={style.dash_top_left}>
            <h6> Welcome Admin</h6>
            <p className="bread-crumps">
              <span className="current-page">Dashboard</span>
            </p>
          </div>
        </div>
        <div className={style.req_wrapper}>
          <div className={style.request}>
            <AdminDashboardCard
              title={"Total Projects"}
              value={projectStats.totalProjects}
              color="blue"
              image="/images/link-square.png"
            />
            <AdminDashboardCard
              title={"Finished Projects"}
              value={projectStats.finishedProjects}
              color="green"
              image="/images/key.png"
            />
            <AdminDashboardCard
              title={"Pending Projects"}
              value={projectStats.pendingProjects}
              color="lightblue"
              image="/images/valett.png"
            />
          </div>
          <div className={style.request}>
            <div
              className={`${style.req_card} ${style.light_violet} ${style.shedule}`}
            >
              <Bar data={chartData} options={chartOptions} />

              <div className={style.request_inside}>
                <div className={style.members_num}>
                  <h4>{approvedUsersCount}</h4>
                  <h5>Developers</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${style.dash_notification} card_block mt-15`}>
          <div className="card_top">
            <div className="section_title">
              <h2>Ongoing Projects</h2>
            </div>
            <div className="card_top_right"></div>
          </div>
          <table className={style.ongoing_projects_table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.filter((project) => project.status === "InProgress")
                .length > 0 ? (
                projects
                  .filter((project) => project.status === "InProgress")
                  .map((ongoingProject) => (
                    <tr key={ongoingProject._id}>
                      <td>{ongoingProject.name}</td>
                      <td>
                        <button className={style.yellowButton}>
                          {ongoingProject.status}
                        </button>
                      </td>{" "}
                    </tr>
                  ))
              ) : (
                <h2>No Ongoing Projects</h2>
              )}
            </tbody>
          </table>
        </div>
        <div className={`${style.dash_notification} card_block mt-15`}>
          <div className="card_top">
            <div className="section_title">
              <h2>All Projects</h2>
            </div>
            <div className="card_top_right"></div>
          </div>
          <table className={style.all_projects_table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.filter((project) => project.status !== "InProgress")
                .length > 0 ? (
                projects
                  .filter((project) => project.status !== "InProgress")
                  .map((project) => (
                    <tr key={project._id}>
                      <td>{project.name}</td>
                      <td>
                        <button className={style.statusButton}>
                          {project.status}
                        </button>
                      </td>{" "}
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="2">No Projects Available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
