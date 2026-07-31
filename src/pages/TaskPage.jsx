import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProjectContext from "../useContext/Project";
import TaskContext from "../useContext/Task";
import TeamContext from '../useContext/Teams'
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserContext from "../useContext/User";
import { toast } from "react-toastify"; 


const TaskPage = () => {
  const navigate = useNavigate();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");

  const { loading, projects, getAllProjectDetails } = useContext(ProjectContext);
  const { teams, getAllTeamDetails } = useContext(TeamContext)
  const { tasks, getAllTaskDetails, createTask } = useContext(TaskContext);
  const { users, getAllUserDetails } = useContext(UserContext)

  // Modal and Form States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    name: "",
    project: "",
    team: "",
    owners: [],
    tags: "",
    status: "To Do",
    timeToComplete: 0,
    dueDate: "",
  });

  useEffect(() => {
    getAllTaskDetails();
    getAllTeamDetails();
    getAllProjectDetails();
    getAllUserDetails()
  }, []);

  // Filter Logic
  const filteredTasks =
    tasks?.filter((task) => {
      // 1. Search Filter (Name only - removed description)
      const matchesSearch =
        searchQuery === "" ||
        task.name.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Status Filter
      const matchesStatus =
        filterStatus === "all" || task.status === filterStatus;

      // 3. Team Filter
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

  // Handle Task Creation
  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!newTaskData.name.trim()) {
      toast.warning("Task name is required");
      return;
    }
    if (!newTaskData.project) {
      toast.warning("Please select a project");
      return;
    }
    if (!newTaskData.team) {
      toast.warning("Please select a team");
      return;
    }
    if (!newTaskData.owners || newTaskData.owners.length === 0) {
      toast.warning("Please select at least one owner");
      return;
    }

    try {
      const payload = {
        name: newTaskData.name.trim(),
        project: newTaskData.project,
        team: newTaskData.team,
        owners: newTaskData.owners,
        tags:
          typeof newTaskData.tags === "string"
            ? newTaskData.tags.split(",").map((t) => t.trim()).filter((t) => t)
            : newTaskData.tags,
        timeToComplete: Number(newTaskData.timeToComplete) || 0,
        status: newTaskData.status,
        dueDate: newTaskData.dueDate || undefined,
      };

      await createTask(payload);

      // Reset form
      setNewTaskData({
        name: "",
        project: "",
        team: "",
        owners: [],
        tags: "",
        status: "To Do",
        timeToComplete: 0,
        dueDate: "",
      });

      setShowTaskModal(false);
      getAllTaskDetails(); // Refresh the task list
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task: " + error.message);
    }
  };

  if (loading && tasks?.length === 0) {
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
                    className="nav-link text-primary py-2 px-3 rounded d-flex align-items-center"
                    style={{ backgroundColor: "#e8e0ff", color: "#6c5ce7" }}
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
              >
                <button
                  onClick={() => navigate("/")}
                  className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </div>
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
              <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
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

            {/* Task List Table - Removed Description Column */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "25%" }}>TASK NAME</th>
                    <th style={{ width: "20%" }}>PROJECT</th>
                    <th style={{ width: "20%" }}>TEAM</th>
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

        {/* Create New Task Modal */}
        {showTaskModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ zIndex: 1050, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={() => setShowTaskModal(false)}
          >
            <div
              className="bg-white rounded shadow-lg p-4"
              style={{ width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", zIndex: 1060 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold m-0">Create New Task</h4>
                <button className="btn-close" onClick={() => setShowTaskModal(false)}></button>
              </div>

              <form onSubmit={handleCreateTask}>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Task Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter task name"
                      value={newTaskData.name}
                      onChange={(e) => setNewTaskData({ ...newTaskData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Project *</label>
                    <select
                      className="form-select"
                      value={newTaskData.project}
                      onChange={(e) => setNewTaskData({ ...newTaskData, project: e.target.value })}
                      required
                    >
                      <option value="">Select Project</option>
                      {projects?.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Team *</label>
                    <select
                      className="form-select"
                      value={newTaskData.team}
                      onChange={(e) => setNewTaskData({ ...newTaskData, team: e.target.value })}
                      required
                    >
                      <option value="">Select Team</option>
                      {teams?.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Owner(s) *</label>
                    <select
                      className="form-select"
                      multiple
                      value={newTaskData.owners}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
                        setNewTaskData({ ...newTaskData, owners: selectedOptions });
                      }}
                      required
                      style={{ minHeight: "100px" }}
                    >
                      {users?.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">Hold Ctrl/Cmd to select multiple owners</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      className="form-select"
                      value={newTaskData.status}
                      onChange={(e) => setNewTaskData({ ...newTaskData, status: e.target.value })}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newTaskData.dueDate}
                      onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Time to Complete (hrs) *</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      min="0"
                      value={newTaskData.timeToComplete}
                      onChange={(e) => setNewTaskData({ ...newTaskData, timeToComplete: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Tags (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., urgent, design"
                      value={newTaskData.tags}
                      onChange={(e) => setNewTaskData({ ...newTaskData, tags: e.target.value })}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowTaskModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default TaskPage;