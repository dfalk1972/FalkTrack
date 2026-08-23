import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Pending.module.css";

// Shown to anyone who's logged in but not yet an active user - either
// still status: "pending" (normal, waiting on admin approval) or
// status: "rejected" (same holding page for now; the message is close
// enough for either case at MVP scope).
export default function Pending() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // BUG FIXED HERE: this page isn't wrapped in ProtectedRoute (it can't
  // be - a pending/rejected user is exactly who ends up here), so
  // nothing else in the app was reacting to the session disappearing
  // after logout. supabase.auth.signOut() was working correctly the
  // whole time, but the page just sat there showing the same content,
  // so clicking "Log Out" looked like it did nothing. Navigating
  // explicitly after logout resolves fixes that.
  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className={styles.container}>
      <h1>Account Pending Approval</h1>
      <p>
        Your account has been created and is waiting for an admin at your
        company to approve it. Check back soon.
      </p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}
