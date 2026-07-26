import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTeam } from "../useContext/Teams";
import { Link } from "react-router-dom";

const TeamPage = () => {
  const { teams, loading, error, getAllTeamDetails, createTeam } = useTeam();

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTeamData, setNewTeamData] = useState({ name: "", description: "" });

  useEffect(() => {
    getAllTeamDetails();
  }, []);

  // Filter teams based on search query
  const filteredTeams =
    teams?.filter(
      (team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await createTeam(newTeamData);
      setNewTeamData({ name: "", description: "" });
      setShowModal(false);
    } catch (error) {
      alert("Failed to create team: " + error.message);
    }
  };

  if (loading && teams.length === 0) {
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
      <div className="d-flex flex-column min-vh-100">
        <main className="d-flex flex-row container-fluid p-0">
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
                    className="nav-link text-primary py-2 px-3 rounded d-flex align-items-center"
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

          {/* Main Content Area */}
          <div className="row g-0">
            <div className="col-12 p-5">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="fw-bold mb-1">Teams</h1>
                  <p className="text-muted mb-0">
                    Manage and track all your teams
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowModal(true)}
                >
                  <i className="bi bi-plus-lg me-1"></i> New Team
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="input-group w-100">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search teams by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-primary" type="button">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Teams Grid */}
              <div className="row g-3">
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((team) => (
                    <div key={team._id} className="col-12 col-md-6 col-lg-4">
                      <div className="card h-100 border-0 shadow-sm p-4 bg-light">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <div
                            className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {team.name.charAt(0).toUpperCase()}
                          </div>
                          <h5 className="fw-bold mb-0">{team.name}</h5>
                        </div>
                        <p className="text-muted small mb-0">
                          {team.description ||
                            "No description available for this team."}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <i className="bi bi-people fs-1 text-muted mb-3 d-block"></i>
                    <h5 className="text-muted">No teams found</h5>
                    <p className="text-muted">
                      Create your first team to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* New Team Modal */}
            {showModal && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                style={{ zIndex: 1050, backgroundColor: "rgba(0,0,0,0.5)" }}
                onClick={() => setShowModal(false)}
              >
                <div
                  className="bg-white rounded shadow-lg p-4"
                  style={{ width: "100%", maxWidth: "500px" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Create New Team</h5>
                    <button
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleCreateTeam}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter team name"
                        value={newTeamData.name}
                        onChange={(e) =>
                          setNewTeamData({
                            ...newTeamData,
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
                        placeholder="Enter team description"
                        value={newTeamData.description}
                        onChange={(e) =>
                          setNewTeamData({
                            ...newTeamData,
                            description: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Create Team
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default TeamPage;
