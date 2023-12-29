import "chart.js/auto";
import DashboardCard from "./DashboardCard";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import style from "./page.module.css";
import { callApi } from "../../../services/API";
import { useEffect, useState } from "react";

export default function UserDashboard() {
  const { userId } = useParams();
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [username, setUsername] = useState("");
  const [ongoingTasks, setOngoingTasks] = useState([]);

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        if (!userId) {
          console.error("UserId is undefined");
          return;
        }

        const token = localStorage.getItem("token");
        const tasks = await callApi("get", `users/${userId}/tasks`, "", token);

        const totalTasks = tasks.tasks.length;
        const completedTasks = tasks.tasks.filter(
          (task) => task.status === "Completed"
        ).length;
        const pendingTasks = totalTasks - completedTasks;
        const ongoingTasks = tasks.tasks.filter(task => task.status === "InProgress");

        setTaskStats({
          totalTasks,
          completedTasks,
          pendingTasks,
        });

        setOngoingTasks(ongoingTasks);
      } catch (error) {
        console.error("Error fetching task stats:", error);
      }
      const token = localStorage.getItem("token");
      const response = await callApi("get", "users-profile", "", token);
      const userData = response.user;
      setUsername({
        username: userData.username,
      });
    };

    fetchTaskStats();
  }, [userId]);

  
  const chartData = {
    labels: ["Completed Tasks", "Pending Tasks"],
    datasets: [
      {
        label: "Task Progress",
        data: [taskStats.completedTasks, taskStats.pendingTasks],
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
            <h6>Welcome {username.username}</h6>
            <p className="bread-crumps">
              <span className="current-page">Dashboard</span>
            </p>
          </div>
        </div>
        <div className={style.req_wrapper}>
          <div className={style.request}>
            <DashboardCard
              title={"Total Tasks"}
              value={taskStats.totalTasks}
              color="blue"
              image="/images/link-square.png"
            />
            <DashboardCard
              title={"Completed Tasks"}
              value={taskStats.completedTasks}
              color="green"
              image="/images/key.png"
            />
            <DashboardCard
              title={"Pending Tasks"}
              value={taskStats.pendingTasks}
              color="lightblue"
              image="/images/valett.png"
            />
          </div>
          <div className={style.request}>
            <div
              className={`${style.req_card} ${style.light_violet} ${style.shedule}`}
            >
              <Bar data={chartData} options={chartOptions} />

             
            </div>
          </div>
        </div>
        <div className={`${style.dash_notification} card_block mt-15`}>
          <div className="card_top">
            <div className="section_title">
              <h2>Ongoing Tasks</h2>
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
              {ongoingTasks.map((ongoingTask) => (
                <tr key={ongoingTask._id}>
                  <td>{ongoingTask.title}</td>
                  <td>
                    <button className={style.yellowButton}>
                      {ongoingTask.status}
                    </button>
                  </td>{" "}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
