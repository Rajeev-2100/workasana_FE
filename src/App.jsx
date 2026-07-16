import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(true);

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSignup = async () => {
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter email and password");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage("Signup Successful. Please Login.");
        setMessageType("success");
        setIsSignup(false);

      } else {
        setMessage(data.error);
        setMessageType("error");
      }
    } catch {
      setMessage("Network Error");
      setMessageType("error");
    }
  };

  const handleLogin = async () => {
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter email and password");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem("token", data.token);

        setMessage("Login Successful");
        setMessageType("success");

        navigate("/dashboardPage");
      } else {
        setMessage(data.error);
        setMessageType("error");
      }
    } catch {
      setMessage("Network Error");
      setMessageType("error");
    }
  };

  return (
    <main
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "100%",
        height: "100vh",
        background: "#f5f5f5",
      }}
    >
      <div
        className="bg-white shadow rounded p-4"
        style={{ width: "420px" }}
      >
        <h3 className="text-center text-primary mb-4">Workasana</h3>

        <h5>{isSignup ? "Create Account" : "Login"}</h5>

        <p className="text-muted">
          {isSignup
            ? "Please create your account."
            : "Please login to continue."}
        </p>

        {message && (
          <div
            className={`alert ${
              messageType === "success"
                ? "alert-success"
                : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <label>Email</label>

        <input
          className="form-control mb-3"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSignup ? (
          <>
            <button
              className="btn btn-primary w-100"
              onClick={handleSignup}
            >
              Sign Up
            </button>

            <p className="text-center mt-3">
              Already have an account?
              <button
                className="btn btn-link"
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
            <button
              className="btn btn-success w-100"
              onClick={handleLogin}
            >
              Login
            </button>

            <p className="text-center mt-3">
              Don't have an account?
              <button
                className="btn btn-link"
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