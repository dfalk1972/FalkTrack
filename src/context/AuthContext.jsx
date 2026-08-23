import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// Holds the logged-in user's Supabase session (from direct client-side
// login) plus their FalkTrack profile (company_id/role/status), fetched
// from Express's GET /api/me using the session's access token.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  // Tracks whether we've actually heard back from Supabase about
  // whether a session exists, at all - starts true because on first
  // mount we genuinely don't know yet. Restoring a persisted session
  // from localStorage is asynchronous, so `session` still being null
  // at that point does NOT mean "logged out," it means "haven't
  // checked yet." See the bug note below the listener - conflating
  // those two was a real bug (bug #1 below).
  const [sessionLoading, setSessionLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // supabase-js fires onAuthStateChange once immediately on subscribe,
  // with whatever the current session actually is (restored from
  // localStorage, or null if there really isn't one) - then again on
  // every future login/logout/refresh. That makes this one listener a
  // complete, reliable source of truth for session state on its own.
  //
  // BUG #1 (fixed): an earlier version of this file ALSO called
  // supabase.auth.getSession().then(...) separately, alongside this
  // listener. That created a race - on mount, the profile effect below
  // could run against the initial `session: null` default BEFORE the
  // actual persisted session had loaded. Relying on just this listener,
  // plus the sessionLoading flag, removed that race.
  //
  // BUG #2 (fixed here): removing bug #1's race left a second, subtler
  // one. `loading` below is `sessionLoading || profileLoading` - but
  // profileLoading only used to flip to true *inside* the profile
  // effect further down, which doesn't run until AFTER this component
  // re-renders with the new session. That left exactly one render, the
  // instant a real session is confirmed, where sessionLoading is
  // already false but profileLoading hasn't been set yet - so `loading`
  // read false while `profile` was still null. ProtectedRoute renders
  // on every AuthContext change too, and its own redirect effect (a
  // child of this provider) fires BEFORE this provider's own profile
  // effect does - React flushes effects child-first - so it saw that
  // one bad render (loading: false, profile: null) and redirected to
  // /pending before the profile fetch this same session change kicked
  // off ever got a chance to resolve. Confirmed via console logging: a
  // real active worker hitting /admin directly showed exactly this
  // render sequence. Fixed by setting profileLoading here too, in the
  // same synchronous callback as setSession/setSessionLoading - React
  // batches all three into one render, so "session confirmed" and
  // "profile fetch about to start" now always show up together. There
  // is no longer a render where a real session coexists with
  // loading: false and profile: null.
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setSessionLoading(false);
        if (newSession) {
          setProfileLoading(true);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Whenever the session changes (login, logout, refresh), re-fetch the
  // FalkTrack profile from Express - this is what carries company_id,
  // role, and status (active/pending/rejected). Waits for sessionLoading
  // to clear first, so it never acts on a session value we don't trust
  // yet (see bug #1 above). profileLoading is already true by the time
  // this runs when there's a session (see bug #2 above) - the
  // setProfileLoading(true) call here is what handles logout, where
  // there's no session and this effect exits early anyway.
  useEffect(() => {
    if (sessionLoading) return;

    if (!session) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(null);
      return;
    }

    setProfileLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => setProfile(data.profile))
      .catch(() => setProfile(null))
      .finally(() => setProfileLoading(false));
  }, [session, sessionLoading]);

  function logout() {
    return supabase.auth.signOut();
  }

  // True while we're either still waiting to hear about the session at
  // all, or waiting on the profile fetch that follows it - either way,
  // consumers (ProtectedRoute) should show a loading state rather than
  // make a redirect decision on incomplete information.
  const loading = sessionLoading || profileLoading;

  return (
    <AuthContext.Provider value={{ session, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Exporting this hook alongside AuthProvider from the same file trips
// react-refresh's "only export components" rule (it means editing this
// file can't hot-reload as cleanly). Keeping the Provider and its hook
// together is the standard Context pattern and worth the tiny dev-time
// cost over splitting into two files.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
