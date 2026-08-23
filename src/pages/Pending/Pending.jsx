import { useAuth } from "../../context/AuthContext";
import styles from "./Pending.module.css";

// Shown to anyone who's logged in but not yet an active user - either
// still status: "pending" (normal, waiting on admin approval) or
// status: "rejected" (same holding page for now; the message is close
// enough for either case at MVP scope).
export default function Pending() {
  const { logout } = useAuth();

  return (
    <div className={styles.container}>
      <h1>Account Pending Approval</h1>
      <p>
        Your account has been created and is waiting for an admin at your
        company to approve it. Check back soon.
      </p>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}
