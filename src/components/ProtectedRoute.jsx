import { Navigate } from "react-router-dom";
import { useUser } from "../useContext/User"; // Adjust path if needed

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  // If no user, redirect to login immediately
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user exists, show the page
  return children;
};

export default ProtectedRoute;