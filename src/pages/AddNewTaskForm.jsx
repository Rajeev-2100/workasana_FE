const AddNewTaskForm = async () => {
  return (
    <>
      <main
        className="d-flex justify-content-center align-items-center"
        style={{
          width: "100%",
          height: "100vh",
          background: "#f5f5f5",
        }}
      >
        <div className="bg-white shadow rounded p-4" style={{ width: "420px" }}>
          <h3 className="text-center text-primary mb-4">workAsana</h3>

          <h5>{isSignup ? "Create Account" : "Login"}</h5>

          <p className="text-muted">
            {isSignup
              ? "Please create your account."
              : "Please login to continue."}
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
              <button className="btn btn-primary w-100" onClick={handleSignup}>
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
              <button className="btn btn-success w-100" onClick={handleLogin}>
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
    </>
  );
};

export default AddNewTaskForm;
