import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// Holds the logged-in user's Supabase session (from direct client-side
// login) plus their FalkTrack profile (company_id/role/status), fetched
// from Express's GET /api/me using the session's access token.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: check for an existing session, then keep listening for
  // login/logout/token-refresh events for as long as the app is open.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Whenever the session changes (login, logout, refresh), re-fetch the
  // FalkTrack profile from Express - this is what carries company_id,
  // role, and status (active/pending/rejected).
  useEffect(() => {
    if (!session) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => setProfile(data.profile))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [session]);

  function logout() {
    return supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ session, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
