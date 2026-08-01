import { useContext, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProjectContext from "../useContext/Project";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TaskContext from "../useContext/Task";
import UserContext from "../useContext/User";
import { toast } from "react-toastify";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { projects, getAllProjectDetails, deleteProject, updateProject } = useContext(ProjectContext);
  const { tasks, getAllTaskDetails } = useContext(TaskContext);
  const { users, getAllUserDetails } = useContext(UserContext);

  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: "", description: "" });

  useEffect(() => {
    getAllProjectDetails();
    getAllTaskDetails();
    getAllUserDetails();
  }, []);

  const project = projects?.find((p) => p._id === projectId);

  useEffect(() => {
    if (project) {
      setEditData({
        name: project.name || "",
        description: project.description || "",
      });
    }
  }, [project]);

  const projectTasks = tasks?.filter((t) => t.project === projectId || t.project?._id === projectId) || [];

  const filteredTasks = projectTasks.filter((task) => {
    if (filterType === "all" || !filterValue) return true;
    if (filterType === "owner") {
      return task.owners?.some((o) => (typeof o === "string" ? o : o.name)?.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (filterType === "tag") {
      return task.tags?.some((t) => t.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (filterType === "date") {
      return new Date(task.dueDate).toLocaleDateString().includes(filterValue);
    }
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31");
    }
    if (sortBy === "priority") {
      const statusOrder = { "To Do": 1, "In Progress": 2, Blocked: 3, Completed: 4 };
      return (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
    }
    return 0;
  });

  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("progress")) return "bg-warning-subtle text-warning";
    if (s.includes("completed") || s.includes("done")) return "bg-success-subtle text-success";
    if (s.includes("todo") || s.includes("to do")) return "bg-secondary-subtle text-secondary";
    if (s.includes("blocked")) return "bg-danger-subtle text-danger";
    return "bg-light text-dark";
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProject(projectId);
        toast.success("Project deleted successfully!");
        navigate("/projects");
      } catch (error) {
        toast.error("Failed to delete project: " + error.message);
      }
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      await updateProject(projectId, editData);
      toast.success("Project updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update project: " + error.message);
    }
  };

  if (!project) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <h3 className="text-muted">Project not found</h3>
          <Link to="/projects" className="btn btn-primary mt-3 text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i> Back to Projects
          </Link>
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
          <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 border-end min-vh-100" style={{ backgroundColor: "#f0e6ff" }}>
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-4 h-100 min-vh-100 position-relative">
              <Link to="/dashboardPage" className="d-flex align-items-center pb-3 mb-md-4 me-md-auto text-decoration-none w-100 justify-content-center justify-content-sm-start">
                <span className="fs-3 fw-bold d-none d-sm-inline" style={{ color: "#3720e5" }}>workAsana</span>
                <i className="bi bi-list fs-2 d-sm-none" style={{ color: "#3720e5" }}></i>
              </Link>

              <ul className="nav flex-column px-3 gap-1 mt-3 w-100">
                <li className="nav-item w-100">
                  <Link to="/dashboardPage" className="nav-link text-secondary py-2 px-3 rounded d-flex align-items-center justify-content-center justify-content-sm-start" style={{ backgroundColor: "#e8e0ff", color: "#6c5ce7" }}>
                    <i className="bi bi-speedometer2 me-sm-2"></i>
                    <span className="d-none d-sm-inline">Dashboard</span>
                  </Link>
                </li>
                <li className="nav-item w-100">
                  <Link to="/projects" className="nav-link text-primary py-2 px-3 rounded d-flex align-items-center justify-content-center justify-content-sm-start">
                    <i className="bi bi-folder me-sm-2"></i>
                    <span className="d-none d-sm-inline">Project</span>
                  </Link>
                </li>
                <li className="nav-item w-100">
                  <Link to="/tasks" className="nav-link text-secondary py-2 px-3 rounded d-flex align-items-center justify-content-center justify-content-sm-start">
                    <i className="bi bi-journal-check me-sm-2"></i>
                    <span className="d-none d-sm-inline">Task</span>
                  </Link>
                </li>
                <li className="nav-item w-100">
                  <Link to="/teams" className="nav-link text-secondary py-2 px-3 rounded d-flex align-items-center justify-content-center justify-content-sm-start">
                    <i className="bi bi-people me-sm-2"></i>
                    <span className="d-none d-sm-inline">Team</span>
                  </Link>
                </li>
                <li className="nav-item w-100">
                  <Link to="/reports" className="nav-link text-secondary py-2 px-3 rounded d-flex align-items-center justify-content-center justify-content-sm-start">
                    <i className="bi bi-graph-up me-sm-2"></i>
                    <span className="d-none d-sm-inline">Reports</span>
                  </Link>
                </li>
                <li className="nav-item w-100">
                  <Link to="/setting" className="nav-link text-secondary py-2 px-3 rounded d-flex align-items-center justify-content-center justify-content-sm-start">
                    <i className="bi bi-gear me-sm-2"></i>
                    <span className="d-none d-sm-inline">Setting</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow-1 p-3 p-md-4 p-lg-5">
            {/* Project Header */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
              <div className="d-flex align-items-center gap-3">
                <Link to="/projects" className="btn btn-outline-secondary btn-sm text-decoration-none">
                  <i className="bi bi-arrow-left me-1"></i> Back
                </Link>
                <div>
                  <h3 className="fw-bold m-0">{project.name}</h3>
                  <small className="text-muted">{project.description || "No description available"}</small>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm" onClick={() => setShowEditModal(true)}>
                  <i className="bi bi-pencil-square me-1"></i> Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={handleDeleteProject}>
                  <i className="bi bi-trash me-1"></i> Delete
                </button>
              </div>
            </div>

            {/* Filters and Sorting Controls */}
            <div className="card border-0 shadow-sm mb-4 bg-light">
              <div className="row g-3 align-items-center p-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted mb-1">Filter By</label>
                  <select className="form-select form-select-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">All Tasks</option>
                    <option value="owner">By Owner</option>
                    <option value="tag">By Tag</option>
                    <option value="date">By Date</option>
                  </select>
                </div>

                {filterType !== "all" && (
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-muted mb-1">Filter Value</label>
                    <input type="text" className="form-control form-control-sm" placeholder={`Enter ${filterType}...`} value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
                  </div>
                )}

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted mb-1">Sort By</label>
                  <select className="form-select form-select-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority / Status</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="row g-3">
              {sortedTasks.length > 0 ? (
                sortedTasks.map((task) => (
                  <div key={task._id} className="col-12">
                    <div className="card border-0 shadow-sm p-3 hover-shadow" style={{ transition: "transform 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
                      <div className="row align-items-center g-3">
                        <div className="col-md-4">
                          <h6 className="fw-bold mb-1 text-dark">{task.name}</h6>
                          <small className="text-muted">{task.project?.description || "No description"}</small>
                        </div>
                        <div className="col-md-2">
                          <span className={`badge ${getStatusBadgeClass(task.status)} px-3 py-2`}>{task.status || "To Do"}</span>
                        </div>
                        <div className="col-md-2">
                          <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: "32px", height: "32px", fontSize: "12px" }}>
                              {task.owners?.[0]?.name?.charAt(0) || "U"}
                            </div>
                            <small className="text-muted text-truncate" style={{ maxWidth: "100px" }} title={task.owners?.[0]?.name}>
                              {task.owners?.[0]?.name || "Unassigned"}
                            </small>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <small className="text-muted d-block"><i className="bi bi-calendar me-1"></i>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</small>
                          <small className="text-muted d-block"><i className="bi bi-clock me-1"></i>{task.timeToComplete || 0} hrs</small>
                        </div>
                        <div className="col-md-2 text-md-end">
                          {task.tags && task.tags.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 justify-content-md-end">
                              {task.tags.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="badge bg-light text-dark border">{tag}</span>
                              ))}
                              {task.tags.length > 2 && <span className="badge bg-light text-dark border">+{task.tags.length - 2}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="text-center py-5 bg-light rounded">
                    <i className="bi bi-clipboard-x fs-1 text-muted mb-3"></i>
                    <p className="text-muted mb-0">{filterType !== "all" && filterValue ? "No tasks match your filter criteria." : "No tasks found for this project yet."}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showEditModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ zIndex: 1050, backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded shadow-lg p-4" style={{ width: "100%", maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Edit Project</h5>
              <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
            </div>
            <form onSubmit={handleUpdateProject}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Project Name</label>
                <input type="text" className="form-control" value={editData?.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea className="form-control" rows="3" value={editData?.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })}></textarea>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProjectDetailPage;