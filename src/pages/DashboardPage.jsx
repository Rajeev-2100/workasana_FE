import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useProjects } from "../useContext/Project";
import { useState, useEffect, useContext } from "react";
import TaskContext from "../useContext/Task";
import UserContext from "../useContext/User";
import TeamContext from "../useContext/Teams";

const DashboardPage = () => {
  const { projects, loading, error, getAllProjectDetails, createProject } = useProjects();
  const { users, getAllUserDetails } = useContext(UserContext);
  const { teams, getAllTeamDetails } = useContext(TeamContext);
  const { tasks, getAllTaskDetails, createTask } = useContext(TaskContext);

  const [showTask, setShowTask] = useState("none");
  const [selectedProject, setSelectedProject] = useState("none");

  // Modal States
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Form States
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    description: "",
  });

  // Consolidated Task State for cleaner management
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

  // "Show More / Show Less" functionality
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);

  // Show Search Query Related
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    getAllProjectDetails();
    getAllTaskDetails();
    getAllUserDetails();
    getAllTeamDetails();
  }, []);

  const filteredProjects =
    projects && projects.length > 0
      ? projects.filter((project) => {
          const matchesFilter =
            selectedProject === "none" || project.name === selectedProject;
          const matchesSearch =
            searchQuery === "" ||
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (project.description &&
              project.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()));

          return matchesFilter && matchesSearch;
        })
      : [];

  const filteredTasks =
    tasks && tasks.length > 0
      ? tasks.filter((task) => {
          const matchesFilter = showTask === "none" || task.status === showTask;

          let matchesSearch = true;
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const nameMatch = task.name?.toLowerCase().includes(query);

            const ownerMatch = Array.isArray(task.owners)
              ? task.owners.some((o) =>
                  (typeof o === "string" ? o : o.name)
                    ?.toLowerCase()
                    .includes(query),
                )
              : typeof task.owners === "string"
                ? task.owners.toLowerCase().includes(query)
                : false;

            const tagMatch = Array.isArray(task.tags)
              ? task.tags.some((t) => t.toLowerCase().includes(query))
              : false;

            matchesSearch = nameMatch || ownerMatch || tagMatch;
          }

          return matchesFilter && matchesSearch;
        })
      : [];

  // COLLAPSE LOGIC: Only show first 4 items unless expanded
  const displayProjects = showAllProjects
    ? filteredProjects
    : filteredProjects.slice(0, 4);
  const displayTasks = showAllTasks ? filteredTasks : filteredTasks.slice(0, 4);

  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("progress")) return "bg-warning-subtle text-warning";
    if (s.includes("completed") || s.includes("done"))
      return "bg-success-subtle text-success";
    if (s.includes("todo") || s.includes("to do"))
      return "bg-secondary-subtle text-secondary";
    if (s.includes("blocked")) return "bg-danger-subtle text-danger";
    return "bg-light text-dark";
  };

  // Handle Project Creation
  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!newProjectData.name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      await createProject({
        name: newProjectData.name,
        description: newProjectData.description,
      });

      setNewProjectData({ name: "", description: "" });
      setShowProjectModal(false);
      await getAllProjectDetails();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create project: " + error.message);
    }
  };

  // Handle Task Creation
  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!newTaskData.name.trim()) {
      alert("Task name is required");
      return;
    }
    if (!newTaskData.project) {
      alert("Please select a project");
      return;
    }
    if (!newTaskData.team) {
      alert("Please select a team");
      return;
    }
    if (!newTaskData.owners || newTaskData.owners.length === 0) {
      alert("Please select at least one owner");
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
            ? newTaskData.tags
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t)
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
      await getAllTaskDetails();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task: " + error.message);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container my-5">
          <div className="alert alert-danger" role="alert">
            Error: {error}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isAnyModalOpen = showProjectModal || showTaskModal;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-grow-1 container-fluid p-0 position-relative">
        <div
          style={{
            filter: isAnyModalOpen ? "blur(4px)" : "none",
            transition: "filter 0.3s ease",
            pointerEvents: isAnyModalOpen ? "none" : "auto",
          }}
        >
          <div className="row g-0 flex-nowrap">
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
                      className="nav-link text-primary py-2 px-3 rounded d-flex align-items-center"
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
                    onClick={handleLogout}
                    className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center gap-2"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span className="d-none d-sm-inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col p-4 bg-white">
              {/* Search Bar */}
              <div className="mb-4">
                <div className="input-group shadow-sm overflow-hidden w-100">
                  <input
                    type="text"
                    className="form-control py-2 ps-4"
                    placeholder="Search projects, tasks, or owners..."
                    aria-label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="btn btn-primary d-flex align-items-center justify-content-center py-2 px-4 border-0"
                    type="button"
                    onClick={() => setSearchQuery("")}
                    title={searchQuery ? "Clear search" : "Search"}
                  >
                    <i
                      className={`bi ${
                        searchQuery ? "bi-x-circle-fill" : "bi-search"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>

              {/* Projects Section */}
              <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <h4 className="m-0 fw-bold text-dark">Projects</h4>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "auto", minWidth: "130px" }}
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                    >
                      <option value="none">Filter</option>
                      {projects?.map((project, index) => (
                        <option
                          key={project._id || index}
                          value={project?.name}
                        >
                          {project?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowProjectModal(true)}
                  >
                    <i className="bi bi-plus-lg me-1"></i>New Project
                  </button>
                </div>

                {projects && projects.length > 0 ? (
                  <>
                    <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3">
                      {/* ✅ FIXED: Correct Link navigation and key placement */}
                      {displayProjects.map((project, index) => (
                        <div key={project._id || index} className="col">
                          <Link
                            to={`/projects/${project._id}`}
                            className="text-decoration-none text-dark"
                          >
                            <div className="card h-100 border-0 shadow-sm p-3 bg-light">
                              <span
                                className={`badge mb-2 ${getStatusBadgeClass(
                                  project.status,
                                )}`}
                                style={{
                                  width: "fit-content",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {project.status || "Active"}
                              </span>
                              <h6 className="card-title fw-bold mb-2 text-dark">
                                {project.name ||
                                  project.title ||
                                  `Project ${index + 1}`}
                              </h6>
                              <p
                                className="card-text text-muted small mb-0"
                                style={{ fontSize: "0.8rem" }}
                              >
                                {project.description ||
                                  "This project centers around compiling a digital moodboard to set the visual direction..."}
                              </p>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>

                    {filteredProjects.length > 4 && (
                      <div className="text-center mt-4">
                        <button
                          className="btn btn-outline-primary btn-sm px-4"
                          onClick={() => setShowAllProjects(!showAllProjects)}
                        >
                          {showAllProjects ? (
                            <>
                              Show Less{" "}
                              <i className="bi bi-chevron-up ms-1"></i>
                            </>
                          ) : (
                            <>
                              Show {filteredProjects.length - 4} More{" "}
                              <i className="bi bi-chevron-down ms-1"></i>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 bg-white rounded shadow-sm">
                    <p className="text-muted mb-0">No projects found</p>
                  </div>
                )}
              </div>

              {/* Tasks Section */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <h4 className="m-0 fw-bold text-dark">My Tasks</h4>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "auto", minWidth: "130px" }}
                      value={showTask}
                      onChange={(e) => setShowTask(e.target.value)}
                    >
                      <option value="none">Filter</option>
                      {["To Do", "In Progress", "Completed", "Blocked"].map(
                        (status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowTaskModal(true)}
                  >
                    <i className="bi bi-plus-lg me-1"></i>New Task
                  </button>
                </div>

                {filteredTasks.length > 0 ? (
                  <>
                    <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3">
                      {/* ✅ FIXED: Made Task cards clickable with Link */}
                      {displayTasks.map((task) => (
                        <div key={task._id} className="col">
                          <Link
                            to={`/tasks/${task._id}`}
                            className="text-decoration-none text-dark"
                          >
                            <div className="card h-100 border-0 shadow-sm p-3 bg-light">
                              <span
                                className={`badge mb-2 ${getStatusBadgeClass(
                                  task.status,
                                )}`}
                                style={{
                                  width: "fit-content",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {task.status || "To Do"}
                              </span>
                              <h6 className="card-title fw-bold mb-2 text-dark">
                                {task.name || "Untitled Task"}
                              </h6>
                              <p
                                className="text-muted small mb-3"
                                style={{ fontSize: "0.8rem" }}
                              >
                                <i className="bi bi-calendar me-1"></i>Due on:{" "}
                                {task.dueDate
                                  ? new Date(task.dueDate).toLocaleDateString()
                                  : "20th Dec 2024"}
                              </p>
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                                  style={{ width: "28px", height: "28px" }}
                                >
                                  <span className="text-white small fw-bold">
                                    {task.team?.name?.charAt(0) || "U"}
                                  </span>
                                </div>
                                <span className="small text-muted">
                                  {task.team?.name || "Unassigned"}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>

                    {filteredTasks.length > 4 && (
                      <div className="text-center mt-4">
                        <button
                          className="btn btn-outline-primary btn-sm px-4"
                          onClick={() => setShowAllTasks(!showAllTasks)}
                        >
                          {showAllTasks ? (
                            <>
                              Show Less{" "}
                              <i className="bi bi-chevron-up ms-1"></i>
                            </>
                          ) : (
                            <>
                              Show {filteredTasks.length - 4} More{" "}
                              <i className="bi bi-chevron-down ms-1"></i>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-5 bg-white rounded shadow-sm">
                    <i className="bi bi-clipboard-x fs-1 text-muted opacity-50 mb-2 d-block"></i>
                    <p className="text-muted mb-0">
                      {showTask === "none"
                        ? "No tasks found."
                        : `No tasks with status "${showTask}" found.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= MODALS ================= */}

        {/* 1. NEW PROJECT MODAL */}
        {showProjectModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ zIndex: 1050, backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            onClick={() => setShowProjectModal(false)}
          >
            <div
              className="bg-white rounded shadow-lg p-4"
              style={{ width: "100%", maxWidth: "500px", zIndex: 1060 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold m-0">Create New Project</h4>
                <button
                  className="btn-close"
                  onClick={() => setShowProjectModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateProject}>
                <div className="mb-3">
                  <label
                    htmlFor="projectName"
                    className="form-label fw-semibold"
                  >
                    Project Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="projectName"
                    placeholder="Enter unique project name"
                    value={newProjectData.name}
                    onChange={(e) =>
                      setNewProjectData({
                        ...newProjectData,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="projectDesc"
                    className="form-label fw-semibold"
                  >
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="projectDesc"
                    rows="3"
                    placeholder="Enter project description"
                    value={newProjectData.description}
                    onChange={(e) =>
                      setNewProjectData({
                        ...newProjectData,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowProjectModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. NEW TASK MODAL */}
        {showTaskModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ zIndex: 1050, backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            onClick={() => setShowTaskModal(false)}
          >
            <div
              className="bg-white rounded shadow-lg p-4"
              style={{
                width: "100%",
                maxWidth: "600px",
                zIndex: 1060,
                maxHeight: "90vh",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold m-0">Create New Task</h4>
                <button
                  className="btn-close"
                  onClick={() => setShowTaskModal(false)}
                ></button>
              </div>

              <form onSubmit={handleCreateTask}>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">
                      Task Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter task name"
                      value={newTaskData.name}
                      onChange={(e) =>
                        setNewTaskData({ ...newTaskData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Project *</label>
                    <select
                      className="form-select"
                      value={newTaskData.project}
                      onChange={(e) =>
                        setNewTaskData({
                          ...newTaskData,
                          project: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Project</option>
                      {projects && projects.length > 0 ? (
                        projects.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No projects available</option>
                      )}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Team *</label>
                    <select
                      className="form-select"
                      value={newTaskData.team}
                      onChange={(e) =>
                        setNewTaskData({ ...newTaskData, team: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Team</option>
                      {teams && teams.length > 0 ? (
                        teams.map((team) => (
                          <option key={team._id} value={team._id}>
                            {team.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No teams available</option>
                      )}
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Owner(s) *</label>
                    <select
                      className="form-select"
                      multiple
                      value={newTaskData.owners}
                      onChange={(e) => {
                        const selectedOptions = Array.from(
                          e.target.selectedOptions,
                        ).map((option) => option.value);
                        setNewTaskData({
                          ...newTaskData,
                          owners: selectedOptions,
                        });
                      }}
                      required
                    >
                      {users && users.length > 0 ? (
                        users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No users available</option>
                      )}
                    </select>
                    <small className="text-muted">
                      Hold Ctrl/Cmd to select multiple owners
                    </small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      className="form-select"
                      value={newTaskData.status}
                      onChange={(e) =>
                        setNewTaskData({
                          ...newTaskData,
                          status: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setNewTaskData({
                          ...newTaskData,
                          dueDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Time to Complete (hrs) *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      min="0"
                      value={newTaskData.timeToComplete}
                      onChange={(e) =>
                        setNewTaskData({
                          ...newTaskData,
                          timeToComplete: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., urgent, design"
                      value={newTaskData.tags}
                      onChange={(e) =>
                        setNewTaskData({ ...newTaskData, tags: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowTaskModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
