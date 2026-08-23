import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

// Captures whatever callback AuthContext hands to onAuthStateChange, so
// tests can fire it manually and control exactly when Supabase "reports
// back" about the session - that timing is the whole point of these
// tests (see the bug note in AuthContext.jsx itself).
let authChangeCallback;

vi.mock("../supabaseClient", () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn((callback) => {
        authChangeCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
      signOut: vi.fn(),
    },
  },
}));

function Consumer() {
  const { profile, loading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="role">{profile?.role ?? "none"}</span>
    </div>
  );
}

// Records every single render's context values as they happen, during
// the render itself rather than from an effect. This is deliberate: an
// effect-based check (or a plain screen.getByTestId assertion made after
// an act() call) only ever sees the state AFTER React has flushed every
// effect from that update, including AuthContext's own profile-fetch
// effect - which hides the exact one-render gap bug #2 (see
// AuthContext.jsx) produced. ProtectedRoute doesn't have that luxury: it
// re-renders on every AuthContext change and makes its redirect decision
// (via <Navigate>, whose own effect fires before AuthContext's) using
// whatever it saw on THAT render, gap or not. Capturing every render is
// what actually catches what ProtectedRoute could see.
function RenderRecorder({ observed }) {
  const { session, profile, loading } = useAuth();
  observed.push({ hasSession: !!session, loading, profile });
  return null;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    authChangeCallback = undefined;
    globalThis.fetch = vi.fn();
  });

  it("stays loading instead of concluding 'logged out' before Supabase reports back", () => {
    // Deliberately NOT calling authChangeCallback here - this is the
    // moment right after mount, before Supabase has said anything about
    // whether a session exists. The bug this guards against: an earlier
    // version of this file treated the still-null initial `session`
    // value as a real "not logged in" answer at exactly this point,
    // which is what sent an actually-logged-in user to the Pending page
    // on a hard reload (see AuthContext.jsx's comment for the full
    // story). It should still read as loading here, not settled.
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading").textContent).toBe("true");
    expect(screen.getByTestId("role").textContent).toBe("none");
  });

  it("loads the real profile once the session actually comes back", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        profile: { company_id: "co-1", role: "admin", status: "active" },
      }),
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    act(() => authChangeCallback("SIGNED_IN", { access_token: "tok-1" }));

    await waitFor(() =>
      expect(screen.getByTestId("role").textContent).toBe("admin")
    );
    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  it("clears the profile when the session disappears (logout)", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        profile: { company_id: "co-1", role: "worker", status: "active" },
      }),
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    act(() => authChangeCallback("SIGNED_IN", { access_token: "tok-1" }));
    await waitFor(() =>
      expect(screen.getByTestId("role").textContent).toBe("worker")
    );

    act(() => authChangeCallback("SIGNED_OUT", null));

    await waitFor(() =>
      expect(screen.getByTestId("role").textContent).toBe("none")
    );
  });

  it("never reports 'not loading' with no profile once a real session is known (the /admin -> /pending bug)", async () => {
    // This is the exact scenario that sent an active, non-admin user to
    // /pending instead of /jobs on a hard reload to /admin: a render
    // where the session is confirmed real (hasSession: true) but
    // `loading` had already gone false before the profile fetch it
    // should have kicked off got a chance to resolve - or even start.
    // ProtectedRoute treats any such render as "definitely no profile,
    // redirect" (see ProtectedRoute.jsx), so this combination must never
    // occur once a session is known. Leaving the fetch permanently
    // unresolved (never calling resolveFetch) forces every render that
    // happens during this test to be inspected, not just the final
    // settled one.
    fetch.mockReturnValue(new Promise(() => {}));

    const observed = [];

    render(
      <AuthProvider>
        <RenderRecorder observed={observed} />
      </AuthProvider>
    );

    act(() => authChangeCallback("SIGNED_IN", { access_token: "tok-1" }));

    const badRender = observed.find(
      (r) => r.hasSession && !r.loading && r.profile === null
    );
    expect(badRender).toBeUndefined();
  });
});
