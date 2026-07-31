import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../useContext/User";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify"; 


const Setting = () => {
  const {
    user,
    updateProfile,
    getUserDetailByUserId,
    changePassword,
    deleteAccount,
    loading,
    logout  
  } = useUser();
  const navigate = useNavigate();

  // Profile State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
  });

  // ✅ Update profile data when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // ✅ Get userId safely
    const userId = user?._id || user?.id;

    if (!userId) {
      toast.warning("Please login again");
      return;
    }

    try {
      await updateProfile(userId, profileData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile: " + error.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const userId = user?._id || user?.id;

    if (!userId) {
      toast.warning("Please login again");
      navigate("/");
      return;
    }

    if (passwordData.newPassword.length !== 6) {
      toast.warning("New password must be exactly 6 characters");
      return;
    }
    try {
      await changePassword(
        userId,
        passwordData.currentPassword,
        passwordData.newPassword,
      );
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error("Failed to change password: " + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    const userId = user?._id || user?.id;

    if (!userId) {
      alert("Sure for logout");
      navigate("/");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (confirmed) {
      try {
        await deleteAccount(userId);
        toast.success("Account deleted successfully");
        navigate("/");
      } catch (error) {
        toast.error("Failed to delete account: " + error.message);
      }
    }
  };

  // ✅ Show loading only if really loading
  if (loading && !user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-grow-1 container-fluid p-0">
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
                    className="nav-link text-secondary py-2 px-3 rounded d-flex align-items-center"
                  >
                    <i className="bi bi-graph-up me-2"></i>
                    <span>Reports</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/setting"
                    className="nav-link text-primary py-2 px-3 rounded d-flex align-items-center"
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
                  onClick={logout}
                  className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center gap-2"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="d-none d-sm-inline">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Settings */}
          <div className="col p-5 bg-white">
            <div className="container" style={{ maxWidth: "1040px" }}>
              <h1 className="fw-bold mb-1 text-center">Settings</h1>

              {/* Update Profile Section */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Update Profile</h5>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">
                          Full name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={profileData?.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          value={profileData?.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary mt-4 px-4"
                      disabled={loading}
                      style={{ backgroundColor: "#6c5ce7", border: "none" }}
                    >
                      {loading ? "Updating..." : "Update Profile"}
                    </button>
                  </form>
                </div>
              </div>

              {/* Change Password Section */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Change Password</h5>
                  <form onSubmit={handlePasswordChange}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">
                          Current password
                        </label>
                        <div className="input-group">
                          <input
                            type={showPassword.current ? "text" : "password"}
                            className="form-control"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            placeholder="Enter current password"
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() =>
                              setShowPassword({
                                ...showPassword,
                                current: !showPassword.current,
                              })
                            }
                          >
                            <i
                              className={`bi ${showPassword.current ? "bi-eye-slash" : "bi-eye"}`}
                            ></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">
                          New password
                        </label>
                        <div className="input-group">
                          <input
                            type={showPassword.new ? "text" : "password"}
                            className="form-control"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="Enter new password"
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() =>
                              setShowPassword({
                                ...showPassword,
                                new: !showPassword.new,
                              })
                            }
                          >
                            <i
                              className={`bi ${showPassword.new ? "bi-eye-slash" : "bi-eye"}`}
                            ></i>
                          </button>
                        </div>
                        <small className="text-muted mt-1 d-block">
                          Password must be exactly 6 characters
                        </small>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary mt-4 px-4"
                      disabled={loading}
                      style={{ backgroundColor: "#6c5ce7", border: "none" }}
                    >
                      {loading ? "Changing..." : "Change Password"}
                    </button>
                  </form>
                </div>
              </div>

              {/* Delete Account Section */}
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-2 text-danger">Delete Account</h5>
                  <p className="text-muted small mb-3">
                    Once you delete your account all your data will be
                    permanently removed and you will be logged out.
                  </p>
                  <button
                    className="btn btn-danger px-4"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    style={{
                      backgroundColor: "#ffe5e5",
                      color: "#dc3545",
                      border: "none",
                    }}
                  >
                    {loading ? "Deleting..." : "Delete Account"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Setting;
