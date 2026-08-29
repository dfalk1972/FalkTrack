import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppHeader from "../../components/AppHeader/AppHeader";
import styles from "./Jobs.module.css";

export default function Jobs() {
  const { session } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function loadJobs() {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();
    setJobs(data.jobs || []);
    setLoading(false);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Could not create job");
      return;
    }

    setTitle("");
    setDescription("");
    loadJobs();
  }

  return (
    <div>
      <AppHeader />
      <div className={styles.container}>
        <h1>Jobs</h1>

        <form onSubmit={handleCreate} className={styles.createForm}>
          <input
            placeholder="Job title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit">Create Job</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs yet - create the first one above.</p>
        ) : (
          <ul className={styles.jobList}>
            {jobs.map((job) => (
              <li key={job.id} className={styles.jobCard}>
                <Link to={`/jobs/${job.id}`}>
                  <strong>{job.title}</strong>
                  <span className={styles.status}> — {job.status}</span>
                  <p>{job.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
