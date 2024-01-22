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
  const [userProjects, setUserProjects] = useState([]);
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        if (!userId) {
          console.error("UserId is undefined");
          return;
        }
        const token = localStorage.getItem("token");
        const response = await callApi(
          "get",
          `projects/user/${userId}`,
          "",
          token
        );
        console.log(response);
    
        let projects = [];
    
        if (Array.isArray(response.projects)) {
          projects = response.projects;
        } else if (
          typeof response.projects === "object" &&
          response.projects !== null
        ) {
          projects = [response.projects];
        } else {
          console.error("Unexpected response format for projects");
        }
    
        setUserProjects(projects);
    
        const tasksPromises = projects.map(async (project) => {
          const tasksResponse = await callApi(
            "get",
            `projects/${project._id}/${userId}/tasks`,
            "",
            token
          );
          const tasks = tasksResponse.tasks || [];
          return {
            projectId: project._id,
            tasks,
          };
        });
    
        const tasksResults = await Promise.all(tasksPromises);
        const tasksMap = {};
        tasksResults.forEach((result) => {
          tasksMap[result.projectId] = result.tasks;
        });
        setUserTasks(tasksMap || {});
      } catch (error) {
        console.error("Error fetching task stats:", error);
      }
      const token = localStorage.getItem("token");
      const response = await callApi("get", "users-profile", "", token);
      const userData = response.user;
      setUsername(userData.username);
    };
    

    fetchTaskStats();
  }, [userId,userTasks]);

  useEffect(() => {
    const allTasks = Object.values(userTasks).flat();
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const pendingTasks = totalTasks - completedTasks;
    const ongoingTasks = allTasks.filter(
      (task) => task.status === "InProgress"
    );

    setTaskStats({
      totalTasks,
      completedTasks,
      pendingTasks,
    });
    setOngoingTasks(ongoingTasks);
  }, [userTasks]);

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

  const isTaskDue = (endDate) => {
    const today = new Date();
    const dueDate = new Date(endDate);
    return dueDate < today;
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
                <th>Project</th>
                <th>Task</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ongoingTasks.length > 0 ? (
                ongoingTasks.map((ongoingTask) => (
                  <tr
                    key={ongoingTask._id}
                    style={{
                      backgroundColor: isTaskDue(ongoingTask.endDate)
                        ? "#ffcccc"
                        : "inherit",
                    }}
                  >
                    {" "}
                    <td>{ongoingTask.projectName}</td>
                    <td>{ongoingTask.title}</td>
                    <td>{new Date(ongoingTask.endDate).toDateString()}</td>
                    <td>
                      <button className={style.yellowButton}>
                        {ongoingTask.status}
                      </button>
                    </td>{" "}
                  </tr>
                ))
              ) : (
                <div>
                  <h2>No Ongoing Tasks</h2>
                </div>
              )}
            </tbody>
          </table>
          <div className={style.dash_notification} card_block mt-15>
            <div className="card_top">
              <div className="card_top_right"></div>
            </div>
            <div className="section_title">
              <h2>All Tasks</h2>
            </div>
            <table className={style.ongoing_projects_table}>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Task</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(userTasks).map((projectId) =>
                  userTasks[projectId]
                    .filter(
                      (filteredTask) => filteredTask.status !== "InProgress"
                    )
                    .map((filteredTask) => (
                      <tr
                        key={filteredTask._id}
                        style={{
                          backgroundColor: isTaskDue(filteredTask.endDate)
                            ? "#ffcccc"
                            : "inherit",
                        }}
                      >
                        <td>{filteredTask.projectName}</td>
                        <td>{filteredTask.title}</td>
                        <td>{new Date(filteredTask.endDate).toDateString()}</td>
                        <td>
                          <button className={style.yellowButton}>
                            {filteredTask.status}
                          </button>
                        </td>
                      </tr>
                    ))
                )}

                {Object.values(userTasks).flat().length === 0 && (
                  <tr>
                    <td colSpan="4">
                      <h3>No tasks present.</h3>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
