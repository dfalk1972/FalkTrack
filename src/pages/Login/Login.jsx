import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Frontend talks to Supabase Auth directly here - Express never sees
    // login. AuthContext's onAuthStateChange listener picks up the new
    // session automatically once this resolves.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    // ProtectedRoute (wrapping /jobs) redirects to /pending on its own
    // if this account turns out not to be active yet - safe to always
    // send successful logins here.
    navigate("/jobs");
  }

  return (
    <div className={styles.container}>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
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
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
