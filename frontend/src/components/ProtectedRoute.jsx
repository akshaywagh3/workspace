import { Navigate } from "react-router-dom";

// This simulates authentication for now
// Later we will replace it with JWT token logic
function isAuthenticated() {
  return localStorage.getItem("token") !== null;
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />; // Redirect to Login
  }
  return children;
}

export default ProtectedRoute;
