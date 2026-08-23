import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppHeader from "../../components/AppHeader/AppHeader";
import styles from "./JobDetail.module.css";

export default function JobDetail() {
  const { id } = useParams();
  const { session } = useAuth();
  const [job, setJob] = useState(null);
  const [myOpenEntry, setMyOpenEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");

  async function loadJob() {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();

    if (res.ok) {
      setJob(data.job);
      setMyOpenEntry(data.myOpenEntry);
    }

    setLoading(false);
  }

  useEffect(() => {
    // loadJob() setState()s as soon as it starts (setLoading(true)) - a
    // newer lint rule flags that as a possible cascading-render smell,
    // but this is the standard "fetch on mount" pattern and React
    // batches it fine in practice.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function callAction(action) {
    setActionError("");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/jobs/${id}/${action}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setActionError(data.error || "Something went wrong");
      return;
    }

    loadJob();
  }

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div>
      <AppHeader />
      <div className={styles.container}>
        <h1>{job.title}</h1>
        <p className={styles.status}>Status: {job.status}</p>
        <p>{job.description}</p>
        <p>Total time logged: {job.total_minutes} minutes</p>

        {actionError && <p className={styles.error}>{actionError}</p>}

        {job.status !== "completed" && (
          <div className={styles.actions}>
            {myOpenEntry ? (
              <button onClick={() => callAction("clock-out")}>
                Clock Out
              </button>
            ) : (
              <button onClick={() => callAction("clock-in")}>
                Clock In
              </button>
            )}
            <button onClick={() => callAction("complete")}>
              Mark Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
