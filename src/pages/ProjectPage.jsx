import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProjectContext from "../useContext/Project";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProjectPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  const { projects, loading, error, getAllProjectDetails, createProject } =
    useContext(ProjectContext);

  useEffect(() => {
    getAllProjectDetails();
  }, []);

  const filteredProjects =
    projects?.filter((project) => {
      const matchesSearch =
        searchQuery === "" ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }) || [];

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject({
        name: newProjectData.name.trim(),
        description: newProjectData.description.trim(),
        status: newProjectData.status,
      });
      setNewProjectData({ name: "", description: "", status: "Active" });
      setShowProjectModal(false);
    } catch (error) {
      alert("Error: " + error.message);
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
                    className="nav-link text-primary py-2 px-3 rounded d-flex align-items-center"
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

          {/* Main Content - ONLY PROJECTS */}
          <div className="flex-grow-1 p-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="fw-bold mb-1" style={{ fontSize: "2rem" }}>
                  Projects
                </h1>
                <p className="text-muted mb-0">
                  Manage and track all your projects
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setShowProjectModal(true)}
              >
                <i className="bi bi-plus-lg me-1"></i>New Project
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Search by the projects Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ backgroundColor: "#f8f9fa" }}
                />
                <button className="btn btn-primary px-4" type="button">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="row g-3">
              {filteredProjects.map((project) => (
                <div key={project._id} className="col-12 col-md-6 col-lg-4">
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-decoration-none"
                  >
                    <div
                      className="card h-100 border-0 shadow-sm p-3"
                      style={{
                        backgroundColor: "#f8f9fa",
                        transition: "transform 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 16px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "";
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span
                          className="badge bg-primary-subtle text-primary"
                          style={{ width: "fit-content" }}
                        >
                          {project.status || "Active"}
                        </span>
                        <i className="bi bi-three-dots text-muted"></i>
                      </div>

                      <h5 className="fw-bold mb-1">{project.name}</h5>
                      <p className="text-muted small mb-0">
                        {project.description || "No description available"}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-folder-x fs-1 text-muted mb-3 d-block"></i>
                <h5 className="text-muted">No projects found</h5>
                <p className="text-muted">
                  Create your first project to get started
                </p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => setShowProjectModal(true)}
                >
                  <i className="bi bi-plus-lg me-2"></i>Create Project
                </button>
              </div>
            )}
          </div>

          {/* New Project Modal */}
          {showProjectModal && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
              style={{ zIndex: 1050, backgroundColor: "rgba(0,0,0,0.5)" }}
              onClick={() => setShowProjectModal(false)}
            >
              <div
                className="bg-white rounded shadow-lg p-4"
                style={{ width: "100%", maxWidth: "500px" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Create New Project</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowProjectModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleCreateProject}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter project name"
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
                    <label className="form-label fw-semibold">
                      Description
                    </label>
                    <textarea
                      className="form-control"
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
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowProjectModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Create Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProjectPage;
