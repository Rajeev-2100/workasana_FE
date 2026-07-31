import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProjectContext from "../useContext/Project";
import TaskContext from "../useContext/Task";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify"; 

const Reports = () => {
  const { projects } = useContext(ProjectContext);
  const { tasks, getAllTaskDetails } = useContext(TaskContext);
  const navigate = useNavigate();

  // Chart refs
  const workDoneChartRef = useRef(null);
  const pendingWorkChartRef = useRef(null);
  const tasksByTeamChartRef = useRef(null);
  const tasksByOwnerChartRef = useRef(null);

  // Chart instances
  const [workDoneChart, setWorkDoneChart] = useState(null);
  const [pendingWorkChart, setPendingWorkChart] = useState(null);
  const [tasksByTeamChart, setTasksByTeamChart] = useState(null);
  const [tasksByOwnerChart, setTasksByOwnerChart] = useState(null);

  useEffect(() => {
    getAllTaskDetails();
  }, []);

  // Calculate metrics
  const getWorkDoneLastWeek = () => {
    if (!tasks) return 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return tasks.filter((task) => {
      if (task.status !== "Completed") return false;
      const completedDate = new Date(task.updatedAt || task.createdAt);
      return completedDate >= oneWeekAgo;
    }).length;
  };

  const getPendingWorkDays = () => {
    if (!tasks) return 0;
    const pendingTasks = tasks.filter((t) => t.status !== "Completed");
    const totalDays = pendingTasks.reduce((acc, task) => {
      if (!task.dueDate) return acc;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return acc + (diffDays > 0 ? diffDays : 0);
    }, 0);
    return totalDays;
  };

  const getTasksByTeam = () => {
    if (!tasks) return [];
    const teamMap = {};
    tasks.forEach((task) => {
      const teamName = task.team?.name || "Unassigned";
      if (!teamMap[teamName]) {
        teamMap[teamName] = 0;
      }
      if (task.status === "Completed") {
        teamMap[teamName]++;
      }
    });
    return Object.entries(teamMap).map(([name, count]) => ({ name, count }));
  };

  const getTasksByOwner = () => {
    if (!tasks) return [];
    const ownerMap = {};
    tasks.forEach((task) => {
      task.owners?.forEach((owner) => {
        const ownerName = typeof owner === "object" ? owner.name : owner;
        if (!ownerMap[ownerName]) {
          ownerMap[ownerName] = 0;
        }
        if (task.status === "Completed") {
          ownerMap[ownerName]++;
        }
      });
    });
    return Object.entries(ownerMap).map(([name, count]) => ({ name, count }));
  };

  // Initialize charts
  useEffect(() => {
    if (!tasks) return;

    // Destroy existing charts
    if (workDoneChart) workDoneChart.destroy();
    if (pendingWorkChart) pendingWorkChart.destroy();
    if (tasksByTeamChart) tasksByTeamChart.destroy();
    if (tasksByOwnerChart) tasksByOwnerChart.destroy();

    // Work Done Last Week Chart (Bar Chart)
    const workDoneCtx = workDoneChartRef.current?.getContext("2d");
    if (workDoneCtx) {
      const newWorkDoneChart = new window.Chart(workDoneCtx, {
        type: "bar",
        data: {
          labels: ["Last Week"],
          datasets: [
            {
              label: "Tasks Completed",
              data: [getWorkDoneLastWeek()],
              backgroundColor: "rgba(108, 92, 231, 0.8)",
              borderColor: "rgba(108, 92, 231, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
          },
        },
      });
      setWorkDoneChart(newWorkDoneChart);
    }

    // Pending Work Chart (Line Chart)
    const pendingCtx = pendingWorkChartRef.current?.getContext("2d");
    if (pendingCtx) {
      const newPendingChart = new window.Chart(pendingCtx, {
        type: "line",
        data: {
          labels: ["Pending Days"],
          datasets: [
            {
              label: "Total Pending Days",
              data: [getPendingWorkDays()],
              borderColor: "rgba(255, 193, 7, 0.8)",
              backgroundColor: "rgba(255, 193, 7, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
      setPendingWorkChart(newPendingChart);
    }

    // Tasks by Team Chart (Doughnut Chart)
    const teamCtx = tasksByTeamChartRef.current?.getContext("2d");
    if (teamCtx) {
      const tasksByTeam = getTasksByTeam();
      const newTeamChart = new window.Chart(teamCtx, {
        type: "doughnut",
        data: {
          labels: tasksByTeam.map((t) => t.name),
          datasets: [
            {
              data: tasksByTeam.map((t) => t.count),
              backgroundColor: [
                "rgba(108, 92, 231, 0.8)",
                "rgba(40, 167, 69, 0.8)",
                "rgba(255, 193, 7, 0.8)",
                "rgba(220, 53, 69, 0.8)",
                "rgba(23, 162, 184, 0.8)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: "bottom" },
          },
        },
      });
      setTasksByTeamChart(newTeamChart);
    }

    // Tasks by Owner Chart (Pie Chart)
    const ownerCtx = tasksByOwnerChartRef.current?.getContext("2d");
    if (ownerCtx) {
      const tasksByOwner = getTasksByOwner();
      const newOwnerChart = new window.Chart(ownerCtx, {
        type: "pie",
        data: {
          labels: tasksByOwner.map((o) => o.name),
          datasets: [
            {
              data: tasksByOwner.map((o) => o.count),
              backgroundColor: [
                "rgba(108, 92, 231, 0.8)",
                "rgba(40, 167, 69, 0.8)",
                "rgba(255, 193, 7, 0.8)",
                "rgba(220, 53, 69, 0.8)",
                "rgba(23, 162, 184, 0.8)",
                "rgba(111, 66, 193, 0.8)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: "bottom" },
          },
        },
      });
      setTasksByOwnerChart(newOwnerChart);
    }

    // Cleanup
    return () => {
      if (workDoneChart) workDoneChart.destroy();
      if (pendingWorkChart) pendingWorkChart.destroy();
      if (tasksByTeamChart) tasksByTeamChart.destroy();
      if (tasksByOwnerChart) tasksByOwnerChart.destroy();
    };
  }, [tasks]);

  return (
    <>
      <Header />
      <main className="d-flex flex-column min-vh-100 ">
        <div className="row g-0 flex-nowrap container-fluid">
          {/* Sidebar */}
          <div
            className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 border-end min-vh-100"
            style={{ backgroundColor: "#f0e6ff" }}
          >
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-4 h-100 min-vh-100 position-relative">
              <Link
                to="/dashboardPage"
                className="d-flex align-items-center pb-3 mb-md-4 me-md-auto text-decoration-none w-100"
              >
                <span
                  className="fs-3 fw-bold d-none d-sm-inline"
                  style={{ color: "#6c5ce7" }}
                >
                  WorkSpaceHub
                </span>
              </Link>

              <ul className="nav flex-column px-3 gap-1 mt-3">
                <li className="nav-item">
                  <Link
                    to="/dashboardPage"
                    className="nav-link text-secondary py-2 px-3 rounded d-flex align-items-center"
                    style={{ backgroundColor: "#e8e0ff", color: "#6c5ce7" }}
                  >
                    <i className="bi bi-speedometer2 me-2"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/projects"
                    className="nav-link text-secondary py-2 px-3 rounded d-flex align-items-center"
                  >
                    <i className="bi bi-folder me-2"></i>
                    <span>Project</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/tasks"
                    className="nav-link text-secondary py-2 px-3 rounded d-flex align-items-center"
                  >
                    <i className="bi bi-journal-check me-2"></i>
                    <span>Task</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/teams"
                    className="nav-link text-secondary py-2 px-3 rounded d-flex align-items-center"
                  >
                    <i className="bi bi-people me-2"></i>
                    <span>Team</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/reports"
                    className="nav-link text-primary py-2 px-3 rounded d-flex align-items-center"
                  >
                    <i className="bi bi-graph-up me-2"></i>
                    <span>Reports</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/setting"
                    className="nav-link text-secondary py-2 px-3 rounded d-flex align-items-center"
                  >
                    <i className="bi bi-gear me-2"></i>
                    <span>Setting</span>
                  </Link>
                </li>
              </ul>

              <div
                className="w-100 px-3 pb-4"
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  right: "0",
                }}
              >
                <button
                  onClick={() => navigate("/")}
                  className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center gap-2"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="d-none d-sm-inline">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Reports */}
          <div className="col p-5 bg-white">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="fw-bold mb-1">Workasana Reports</h1>
                <p className="text-muted mb-0">
                  Task completion metrics and statistics
                </p>
              </div>
              <Link
                to="/dashboardPage"
                className="btn btn-outline-secondary btn-sm"
              >
                <i className="bi bi-arrow-left me-1"></i>Back to Dashboard
              </Link>
            </div>

            {/* Report Overview */}
            <div className="row g-4">
              {/* Total Work Done Last Week */}
              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-4">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Total Work Done Last Week
                    </h5>
                    <div
                      className="chart-container"
                      style={{ position: "relative", height: "300px" }}
                    >
                      <canvas ref={workDoneChartRef}></canvas>
                    </div>
                    <div className="mt-3 text-center">
                      <h2 className="text-success mb-0">
                        {getWorkDoneLastWeek()}
                      </h2>
                      <small className="text-muted">Tasks Completed</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Days of Work Pending */}
              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-4">
                      <i className="bi bi-clock-fill text-warning me-2"></i>
                      Total Days of Work Pending
                    </h5>
                    <div
                      className="chart-container"
                      style={{ position: "relative", height: "300px" }}
                    >
                      <canvas ref={pendingWorkChartRef}></canvas>
                    </div>
                    <div className="mt-3 text-center">
                      <h2 className="text-warning mb-0">
                        {getPendingWorkDays()}
                      </h2>
                      <small className="text-muted">Days Remaining</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks Closed by Team */}
              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-4">
                      <i className="bi bi-people-fill text-primary me-2"></i>
                      Tasks Closed by Team
                    </h5>
                    <div
                      className="chart-container"
                      style={{ position: "relative", height: "300px" }}
                    >
                      <canvas ref={tasksByTeamChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks Closed by Owner */}
              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-4">
                      <i className="bi bi-person-check-fill text-info me-2"></i>
                      Tasks Closed by Owner
                    </h5>
                    <div
                      className="chart-container"
                      style={{ position: "relative", height: "300px" }}
                    >
                      <canvas ref={tasksByOwnerChartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Reports;
