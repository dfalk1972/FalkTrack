import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./AppHeader.module.css";

// Simple shared header for logged-in pages (Jobs, Job Detail, and later
// Assets/Admin). Home.jsx has its own marketing nav and isn't touched by
// this - this one's only for pages wrapped in ProtectedRoute.
export default function AppHeader() {
  const { logout } = useAuth();

  return (
    <header className={styles.header}>
      <Link to="/jobs" className={styles.logo}>
        FalkTrack
      </Link>
      <nav className={styles.nav}>
        <Link to="/jobs">Jobs</Link>
        <button onClick={logout} className={styles.logoutButton}>
          Log Out
        </button>
      </nav>
    </header>
  );
}
