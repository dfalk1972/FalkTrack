import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Wrap any route that requires a logged-in, approved user.
// Not logged in -> /login. Logged in but pending/rejected -> /pending.
// Logged in and active -> render the actual page.
export default function ProtectedRoute({ children }) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!profile || profile.status !== "active") {
    return <Navigate to="/pending" replace />;
  }

  return children;
}
