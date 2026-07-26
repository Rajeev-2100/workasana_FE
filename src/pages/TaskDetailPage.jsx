import { useContext, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProjectContext from "../useContext/Project";
import TaskContext from "../useContext/Task";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const {
    projects,
    users,
    teams,
    loading,
    getAllProjectDetails,
    getAllUserDetails,
    getAllTeamDetails,
  } = useContext(ProjectContext);

  const { tasks, getAllTaskDetails, deleteTask, updateTask } =
    useContext(TaskContext) || useContext(ProjectContext);

  const [editData, setEditData] = useState({
    name: "",
    description: "",
    status: "To Do",
    dueDate: "",
    timeToComplete: 0,
    tags: "",
    project: "",
    team: "",
    owners: [],
  });

  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    getAllTaskDetails();
    getAllProjectDetails();
    getAllUserDetails();
    getAllTeamDetails();
  }, []);

  const task = tasks?.find((t) => t._id === taskId);

  useEffect(() => {
    if (task) {
      setEditData({
        name: task.name || "",
        description: task.description || "",
        status: task.status || "To Do",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        timeToComplete: task.timeToComplete || 0,
        tags: Array.isArray(task.tags) ? task.tags.join(", ") : task.tags || "",
        project:
          typeof task.project === "object"
            ? task.project?._id
            : task.project || "",
        team: typeof task.team === "object" ? task.team?._id : task.team || "",
        owners: Array.isArray(task.owners)
          ? task.owners.map((o) => (typeof o === "object" ? o._id : o))
          : [],
      });
    }
  }, [task]);

  const projectId =
    typeof task?.project === "object" ? task.project?._id : task?.project;
  const projectDetail = projects?.find((p) => p._id === projectId);

  const teamId = typeof task?.team === "object" ? task.team?._id : task?.team;
  const team = teams?.find((t) => t._id === teamId);

  const ownerIds = Array.isArray(task?.owners) ? task.owners : [];
  const resolvedOwners = ownerIds
    .map((id) => {
      if (typeof id === "object" && id !== null) return id;
      return users?.find((u) => u._id === id);
    })
    .filter(Boolean);

  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("progress")) return "bg-warning text-dark border-0";
    if (s.includes("completed")) return "bg-success text-white border-0";
    if (s.includes("todo") || s.includes("to do"))
      return "bg-secondary text-white border-0";
    if (s.includes("blocked")) return "bg-danger text-white border-0";
    return "bg-light text-dark border-0";
  };

  const handleDeleteTask = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        alert("Task deleted successfully!");
        navigate("/tasks");
      } catch (error) {
        alert("Failed to delete task: " + error.message);
      }
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editData,
        tags:
          typeof editData.tags === "string"
            ? editData.tags
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t)
            : editData.tags,
      };

      await updateTask(taskId, payload);
      alert("Task updated successfully!");
      setShowEditModal(false);
      getAllTaskDetails();
    } catch (error) {
      alert("Failed to update task: " + error.message);
    }
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

  if (!task) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <h3 className="text-muted">Task not found</h3>
          <Link
            to="/tasks"
            className="btn btn-primary mt-3 text-decoration-none"
          >
            <i className="bi bi-arrow-left me-1"></i> Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main>
        <div
          className="d-flex min-vh-100"
          style={{ backgroundColor: "#f5f7fa" }}
        >
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
                    className="nav-link py-2 px-3 rounded d-flex align-items-center"
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
              ></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow-1 p-5">
            <div className="container-fluid" style={{ maxWidth: "1200px" }}>
              {/* Back Link */}
              <div className="mb-4">
                <Link
                  to="/tasks"
                  className="text-decoration-none text-muted d-inline-flex align-items-center gap-2"
                >
                  <i className="bi bi-arrow-left"></i>
                  <span>Back to All Tasks</span>
                </Link>
              </div>

              {/* Task Header */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h1 className="fw-bold mb-2 display-6">{task.name}</h1>
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className={`badge px-3 py-2 ${getStatusBadgeClass(task.status)}`}
                      style={{ borderRadius: "6px", fontSize: "0.85rem" }}
                    >
                      {task.status || "To Do"}
                    </span>
                    <small className="text-muted">
                      Created on {new Date(task.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary px-4"
                    onClick={() => setShowEditModal(true)}
                  >
                    <i className="bi bi-pencil-square me-2"></i>Edit Task
                  </button>
                  <button
                    className="btn btn-danger px-4"
                    onClick={handleDeleteTask}
                  >
                    <i className="bi bi-trash me-2"></i>Delete
                  </button>
                </div>
              </div>

              {/* Main Content Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  {/* Description Section */}
                  <div className="mb-4">
                    <h5 className="fw-semibold mb-3">Description</h5>
                    <p
                      className="text-muted mb-0"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {task.description ||
                        "No description provided for this task."}
                    </p>
                  </div>

                  <hr className="my-4" />

                  {/* Task Details Grid */}
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-4">
                        <h6 className="text-muted text-uppercase small fw-semibold mb-3">
                          Task Details
                        </h6>

                        <div className="mb-3">
                          <div className="text-muted small mb-1">Project</div>
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-folder-fill text-primary"></i>
                            <Link
                              to={`/projects/${projectDetail?._id}`}
                              className="text-decoration-none fw-medium"
                            >
                              {projectDetail?.name || "Unknown Project"}
                            </Link>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-muted small mb-1">Team</div>
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-people-fill text-info"></i>
                            <span className="fw-medium">
                              {team?.name || "Unassigned"}
                            </span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-muted small mb-2">Assignees</div>
                          <div className="d-flex flex-wrap gap-2">
                            {resolvedOwners.length > 0 ? (
                              resolvedOwners.map((owner, idx) => (
                                <div
                                  key={idx}
                                  className="d-flex align-items-center gap-2 bg-light px-3 py-2 rounded-3"
                                >
                                  <div
                                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                                    style={{
                                      width: "28px",
                                      height: "28px",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {owner.name ? owner.name.charAt(0) : "U"}
                                  </div>
                                  <small className="fw-medium">
                                    {owner.name || "Unknown"}
                                  </small>
                                </div>
                              ))
                            ) : (
                              <span className="text-muted">No assignees</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="mb-4">
                        <h6 className="text-muted text-uppercase small fw-semibold mb-3">
                          Timeline & Tags
                        </h6>

                        <div className="mb-3">
                          <div className="text-muted small mb-1">Due Date</div>
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-calendar-event text-warning"></i>
                            <span className="fw-medium">
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )
                                : "No due date"}
                            </span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-muted small mb-1">
                            Time Estimate
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-clock-history text-secondary"></i>
                            <span className="fw-medium">
                              {task.timeToComplete || 0} hours
                            </span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-muted small mb-2">Tags</div>
                          <div className="d-flex flex-wrap gap-2">
                            {task.tags && task.tags.length > 0 ? (
                              task.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="badge bg-light text-dark border"
                                  style={{
                                    padding: "8px 14px",
                                    borderRadius: "20px",
                                    fontSize: "0.85rem",
                                    fontWeight: "500",
                                  }}
                                >
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted">No tags</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {showEditModal && (
            <div
              className="modal show d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              onClick={() => setShowEditModal(false)}
            >
              <div
                className="modal-dialog modal-lg modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">Edit Task</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowEditModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleUpdateTask}>
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Status
                          </label>
                          <select
                            className="form-select"
                            value={editData.status}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
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
                          <label className="form-label fw-semibold">
                            Due Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            value={editData.dueDate}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                dueDate: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Task Name *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter task name"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Project *
                          </label>
                          <select
                            className="form-select"
                            value={editData.project}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
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
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Team *
                          </label>
                          <select
                            className="form-select"
                            value={editData.team}
                            onChange={(e) =>
                              setEditData({ ...editData, team: e.target.value })
                            }
                            required
                          >
                            <option value="">Select Team</option>
                            {teams && teams.length > 0 ? (
                              teams.map((t) => (
                                <option key={t._id} value={t._id}>
                                  {t.name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No teams available</option>
                            )}
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Owner(s) *
                          </label>
                          <select
                            className="form-select"
                            multiple
                            value={editData.owners}
                            onChange={(e) => {
                              const selectedOptions = Array.from(
                                e.target.selectedOptions,
                              ).map((option) => option.value);
                              setEditData({
                                ...editData,
                                owners: selectedOptions,
                              });
                            }}
                            required
                            style={{ minHeight: "100px" }}
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
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={editData.description}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              description: e.target.value,
                            })
                          }
                        ></textarea>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Time Estimate (hrs)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={editData.timeToComplete}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                timeToComplete: Number(e.target.value),
                              })
                            }
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
                            value={editData.tags}
                            onChange={(e) =>
                              setEditData({ ...editData, tags: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setShowEditModal(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TaskDetailPage;
