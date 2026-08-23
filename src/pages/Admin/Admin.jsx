import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AppHeader from "../../components/AppHeader/AppHeader";
import styles from "./Admin.module.css";

// Turns a raw minute count into "1h 25m" for the time log table.
// null means the entry is still running (no clock_out yet).
function formatDuration(minutes) {
  if (minutes === null || minutes === undefined) return "in progress";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export default function Admin() {
  const { session } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeaders = { Authorization: `Bearer ${session.access_token}` };

  async function loadAll() {
    setLoading(true);
    setError("");

    const [pendingRes, logsRes] = await Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/pending-users`, {
        headers: authHeaders,
      }),
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/time-logs`, {
        headers: authHeaders,
      }),
    ]);

    if (!pendingRes.ok || !logsRes.ok) {
      setError("Could not load admin data");
      setLoading(false);
      return;
    }

    const pendingData = await pendingRes.json();
    const logsData = await logsRes.json();

    setPendingUsers(pendingData.pendingUsers);
    setTimeLogs(logsData.timeLogs);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDecision(userId, decision) {
    setError("");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/${decision}`,
      { method: "POST", headers: authHeaders }
    );

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || `Could not ${decision} user`);
      return;
    }

    // Just refresh the pending list rather than trying to patch state
    // by hand - simpler, and this list is never long enough to matter.
    loadAll();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <AppHeader />
      <div className={styles.container}>
        <h1>Admin Panel</h1>
        {error && <p className={styles.error}>{error}</p>}

        <h2>Pending Users</h2>
        {pendingUsers.length === 0 ? (
          <p>No pending users right now.</p>
        ) : (
          <ul className={styles.userList}>
            {pendingUsers.map((user) => (
              <li key={user.id} className={styles.userCard}>
                <div>
                  <strong>{user.full_name}</strong>
                  <p className={styles.meta}>{user.email}</p>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => handleDecision(user.id, "approve")}>
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(user.id, "reject")}
                    className={styles.rejectButton}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h2>Time Logs</h2>
        {timeLogs.length === 0 ? (
          <p>No time entries yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Worker</th>
                <th>Job</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {timeLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.worker_name}</td>
                  <td>{log.job_title}</td>
                  <td>{new Date(log.clock_in).toLocaleString()}</td>
                  <td>
                    {log.clock_out
                      ? new Date(log.clock_out).toLocaleString()
                      : "—"}
                  </td>
                  <td>{formatDuration(log.duration_minutes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
