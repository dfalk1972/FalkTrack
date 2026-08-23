import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Wrap any route that requires a logged-in, approved user.
// Not logged in -> /login. Logged in but pending/rejected -> /pending.
// Logged in and active -> render the actual page.
// Pass adminOnly to also require profile.role === "admin" - a non-admin
// who somehow lands on an admin URL gets bounced to /jobs rather than
// seeing the page (the real enforcement is still server-side, via
// requireAdmin - this is just so the UI doesn't dead-end them).
export default function ProtectedRoute({ children, adminOnly = false }) {
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

  if (adminOnly && profile.role !== "admin") {
    return <Navigate to="/jobs" replace />;
  }

  return children;
}
