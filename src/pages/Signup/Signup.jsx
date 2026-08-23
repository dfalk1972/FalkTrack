import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";

export default function Signup() {
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Populate the company dropdown from Express's public companies list -
  // this has to be public since the user doesn't have an account yet.
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/companies`)
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies))
      .catch(() => setError("Could not load companies. Try refreshing."));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: companyId,
        full_name: fullName,
        email,
        password,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Signup failed. Please try again.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className={styles.container}>
        <h1>Account Created</h1>
        <p>
          Your account is waiting for an admin at your company to approve
          it. You'll be able to log in once that happens.
        </p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Company
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            required
          >
            <option value="">Select a company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Full Name
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
