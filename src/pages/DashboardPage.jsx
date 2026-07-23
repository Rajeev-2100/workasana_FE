import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useProjects } from "../useContext/Project";
import { useState } from "react";
import { useEffect } from "react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    projects,
    tasks,
    loading,
    error,
    getAllProjectDetails,
    getAllTaskDetails,
  } = useProjects();
  const [hasFetched, setHasFetched] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    getAllProjectDetails();
    getAllTaskDetails();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  console.log(tasks);

  if (error) {
    return (
      <>
        <Header />
        <div className="alert alert-danger m-5" role="alert">
          Error: {error}
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="m-0 p-0" style={{ width: "100%", height: "80%" }}>
        <div className="d-flex">
          <div className="d-flex bg-secondary">
            <div
              className="d-flex flex-column"
              style={{ width: "280px", height: "90vh" }}
            >
              <Link className="navbar-brand mt-5" to="/dashboardPage"></Link>
              <div
                className="collapse navbar-collapse d-flex flex-column row-gap-3"
                id="navbarNavAltMarkup"
              >
                <Link className="nav-link" to="/dashboardPage">
                  <h5 className="text-white fs-4">
                    <b>SideBar</b>
                  </h5>
                </Link>
                <div className="navbar-nav d-flex flex-column align-items-center text-white fs-5 row-gap-3 text-dark">
                  <Link className="nav-link" to="/project">
                    Project
                  </Link>
                  <Link className="nav-link" to="/team">
                    Team
                  </Link>
                  <Link className="nav-link" to="/reports">
                    Reports
                  </Link>
                  <Link className="nav-link" to="/setting">
                    Setting
                  </Link>
                </div>
                <div>
                  <button onClick={handleLogout} className="btn btn-danger">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex" style={{ width: "calc(100% - 280px)" }}>
            <div className="bg-light-subtle w-100 p-4">
              <h4 className="text-center pt-4">Main Content</h4>

              <div className="mt-4">
                <h5 className="mb-3">Projects ({projects?.length || 0})</h5>
                {projects && projects.length > 0 ? (
                  <div className="d-flex flex-wrap gap-3">
                    {projects.map((project, index) => (
                      <div
                        key={project._id || index}
                        className="card p-3"
                        style={{ width: "200px" }}
                      >
                        <i className="bi bi-folder text-primary fs-2"></i>
                        <p className="mt-2 mb-0 fw-bold">
                          {project.name ||
                            project.title ||
                            `Project ${index + 1}`}
                        </p>
                        <small className="text-muted">
                          {project.status || "Active"}
                        </small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No projects found</p>
                )}
              </div>

              <hr className="my-4" />

              <div className="mt-4">
                <h5 className="mb-3">My Tasks</h5>
                <div className="card p-4 shadow-sm">
                  <div className="w-100">
                    {tasks && tasks.length > 0 ? (
                      tasks.map((task) => (
                        <div
                          key={task._id}
                          className="row align-items-center py-2 border-bottom"
                        >
                          {/* Task Name - takes up half the width */}
                          <div className="col-6 text-start">
                            <span className="fw-semibold text-dark">
                              {task.name}
                            </span>
                          </div>

                          {/* Time to complete - takes up 3 columns */}
                          <div className="col-3 text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {task.timeToComplete} hrs
                          </div>

                          {/* Team Name - takes up the last 3 columns */}
                          <div className="col-3 text-end">
                            <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
                              {task.team?.name || "No Team"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-3">
                        <button className="btn btn-primary btn-sm">
                          <i className="bi bi-plus-circle me-1"></i>
                          Add Task
                        </button>
                      </div>
                    )}
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

export default DashboardPage;
