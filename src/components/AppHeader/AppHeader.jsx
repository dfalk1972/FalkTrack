import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./AppHeader.module.css";

// Simple shared header for logged-in pages (Jobs, Job Detail, Assets,
// Asset Detail, Admin, Schema). Home.jsx has its own marketing nav and
// isn't touched by this.
export default function AppHeader() {
  const { logout, profile } = useAuth();

  return (
    <header className={styles.header}>
      <Link to="/jobs" className={styles.logo}>
        FalkTrack
      </Link>
      <nav className={styles.nav}>
        <Link to="/jobs">Jobs</Link>
        <Link to="/assets">Assets</Link>
        <Link to="/schema">Schema</Link>
        {profile?.role === "admin" && <Link to="/admin">Admin</Link>}
        <button onClick={logout} className={styles.logoutButton}>
          Log Out
        </button>
      </nav>
    </header>
  );
}
