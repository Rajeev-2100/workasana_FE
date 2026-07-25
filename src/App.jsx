import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSignup = async () => {
    setMessage("");

    // 1. Validate all fields for signup
    if (!name || !email || !password) {
      setMessage("Please enter name, email, and password");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) { // response.ok is true for status 200-299
        setMessage("Signup Successful. Please Login.");
        setMessageType("success");
        setIsSignup(false);
        
        // Clear fields after successful signup
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(data.error || "Signup failed");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Network Error. Please try again.");
      setMessageType("error");
    }
  };

  const handleLogin = async () => {
    setMessage("");

    // 1. Validate only email and password for login
    if (!email || !password) {
      setMessage("Please enter email and password");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Login Successful");
        setMessageType("success");
        
        // Navigate to dashboard
        navigate("/dashboardPage");
      } else {
        setMessage(data.error || "Login failed");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Network Error. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <main
      className="d-flex justify-content-center align-items-center"
      style={{ width: "100%", height: "100vh", background: "#f5f5f5" }}
    >
      <div className="bg-white shadow rounded p-4" style={{ width: "420px" }}>
        <h3 className="text-center text-primary mb-4">WorkSpaceHub</h3>

        <h5>{isSignup ? "Create Account" : "Login"}</h5>
        <p className="text-muted">
          {isSignup ? "Please create your account." : "Please login to continue."}
        </p>

        {message && (
          <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}

        {/* Name field only shows during Signup */}
        {isSignup && (
          <>
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
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
            <p className="text-center mt-3 mb-0">
              Already have an account?{" "}
              <button
                className="btn btn-link p-0"
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
            <p className="text-center mt-3 mb-0">
              Don't have an account?{" "}
              <button
                className="btn btn-link p-0"
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
}

export default App;