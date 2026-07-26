import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProjectContext from "../useContext/Project";
import TaskContext from "../useContext/Task";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TaskPage = () => {
  const navigate = useNavigate();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");

  const { teams, loading, getAllTeamDetails } = useContext(ProjectContext);

  const { tasks, getAllTaskDetails } = useContext(TaskContext);

  useEffect(() => {
    getAllTaskDetails();
    getAllTeamDetails();
  }, []);

  // Filter Logic
  const filteredTasks =
    tasks?.filter((task) => {
      // 1. Search Filter (Name or Description)
      const matchesSearch =
        searchQuery === "" ||
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Status Filter
      const matchesStatus =
        filterStatus === "all" || task.status === filterStatus;

      // 3. Team Filter
      // Assuming task.team is an ID string or object. We match against team._id or team name
      let matchesTeam = true;
      if (filterTeam !== "all") {
        const taskTeamId =
          typeof task.team === "object" ? task.team._id : task.team;
        matchesTeam = taskTeamId === filterTeam;
      }

      return matchesSearch && matchesStatus && matchesTeam;
    }) || [];

  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("progress"))
      return "bg-warning-subtle text-warning border-0";
    if (s.includes("completed"))
      return "bg-success-subtle text-success border-0";
    if (s.includes("todo") || s.includes("to do"))
      return "bg-secondary-subtle text-secondary border-0";
    if (s.includes("blocked")) return "bg-danger-subtle text-danger border-0";
    return "bg-light text-dark border-0";
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main>
        <div className="d-flex min-vh-100 bg-white">
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
                  style={{ color: "#3720e5" }}
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
                    className="nav-link text-secondary  py-2 px-3 rounded d-flex align-items-center"
                  >
                    <i className="bi bi-folder me-2"></i>
                    <span>Project</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/tasks"
                    className="nav-link text-primary py-2 px-3 rounded d-flex align-items-center"
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
                    className="nav-link text-secondary py-2 px-3 rounded d-flex align-items-center"
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
              ></div>
            </div>
          </div>

          {/* Main Content - TASK LIST */}
          <div className="flex-grow-1 p-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="fw-bold mb-1">All Tasks</h1>
                <p className="text-muted mb-0">
                  Manage and track all tasks across projects
                </p>
              </div>
              <button className="btn btn-primary">
                <i className="bi bi-plus-lg me-1"></i>New Task
              </button>
            </div>

            {/* Filters Bar */}
            <div className="card border-0 shadow-sm mb-4 bg-light">
              <div className="row g-3 align-items-center p-3">
                {/* Search */}
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                {/* Team Filter */}
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterTeam}
                    onChange={(e) => setFilterTeam(e.target.value)}
                  >
                    <option value="all">All Teams</option>
                    {teams?.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2 text-end">
                  <span className="text-muted small">
                    {filteredTasks.length} Tasks Found
                  </span>
                </div>
              </div>
            </div>

            {/* Task List Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "30%" }}>TASK NAME</th>
                    <th style={{ width: "15%" }}>PROJECT</th>
                    <th style={{ width: "15%" }}>TEAM</th>
                    <th style={{ width: "15%" }}>STATUS</th>
                    <th style={{ width: "15%" }}>DUE DATE</th>
                    <th style={{ width: "10%" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <tr key={task._id}>
                        <td>
                          <div className="fw-semibold text-dark">
                            {task.name}
                          </div>
                          <small
                            className="text-muted text-truncate d-block"
                            style={{ maxWidth: "250px" }}
                          >
                            {task.description || "No description"}
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {typeof task.project === "object"
                              ? task.project?.name
                              : "Unknown Project"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                              style={{
                                width: "24px",
                                height: "24px",
                                fontSize: "10px",
                              }}
                            >
                              {(typeof task.team === "object"
                                ? task.team.name
                                : "T"
                              ).charAt(0)}
                            </div>
                            <small>
                              {typeof task.team === "object"
                                ? task.team.name
                                : "Unassigned"}
                            </small>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${getStatusBadgeClass(task.status)}`}
                          >
                            {task.status || "To Do"}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "-"}
                          </small>
                        </td>
                        <td>
                          <Link
                            to={`/tasks/${task._id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        <i className="bi bi-clipboard-x fs-1 d-block mb-2"></i>
                        No tasks found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TaskPage;
