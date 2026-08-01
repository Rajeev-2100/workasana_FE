import { useContext } from "react";
import UserContext from "./useContext/User";

// Removed `async` because React components cannot be async
const AddNewTaskForm = () => {
  // Added missing context so the variables work
  const { 
    email, password, isSignup, message, messageType, 
    handleSignup, handleLogin, setEmail, setPassword, 
    setIsSignup, setMessage 
  } = useContext(UserContext);

  return (
    <main
      className="d-flex justify-content-center align-items-center p-3"
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <div className="bg-white shadow rounded p-4 w-100" style={{ maxWidth: "420px" }}>
        <h3 className="text-center text-primary mb-4">workAsana</h3>

        <h5>{isSignup ? "Create Account" : "Login"}</h5>

        <p className="text-muted">
          {isSignup ? "Please create your account." : "Please login to continue."}
        </p>

        {message && (
          <div
            className={`alert ${
              messageType === "success" ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <label className="form-label">Email</label>
        <input
          className="form-control mb-3"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="form-label">Password</label>
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSignup ? (
          <>
            <button className="btn btn-primary w-100" onClick={handleSignup}>
              Sign Up
            </button>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <button
                className="btn btn-link p-0 align-baseline"
                onClick={() => {
                  setIsSignup(false);
                  setMessage("");
                }}
              >
                Login
              </button>
            </p>
          </>
        ) : (
          <>
            <button className="btn btn-success w-100" onClick={handleLogin}>
              Login
            </button>

            <p className="text-center mt-3">
              Don't have an account?{" "}
              <button
                className="btn btn-link p-0 align-baseline"
                onClick={() => {
                  setIsSignup(true);
                  setMessage("");
                }}
              >
                Sign Up
              </button>
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default AddNewTaskForm;