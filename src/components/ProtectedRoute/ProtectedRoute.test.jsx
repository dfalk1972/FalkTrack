import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

// Swaps the real AuthContext for a mock we control per-test, instead of
// wrapping every render in a real AuthProvider (which would try to talk
// to Supabase). This is the same "fake the boundary, test the real
// logic" idea as the proxyquire stubs on the backend.
vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// A tiny route tree so <Navigate> redirects actually land somewhere we
// can assert on, instead of just checking that ProtectedRoute "tried"
// to redirect.
function renderProtected({ adminOnly = false } = {}) {
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route path="/login" element={<p>Login Page</p>} />
        <Route path="/pending" element={<p>Pending Page</p>} />
        <Route path="/jobs" element={<p>Jobs Page</p>} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute adminOnly={adminOnly}>
              <p>Secret Content</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("shows a loading state before auth resolves", () => {
    useAuth.mockReturnValue({ session: null, profile: null, loading: true });

    renderProtected();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to /login when there is no session", () => {
    useAuth.mockReturnValue({ session: null, profile: null, loading: false });

    renderProtected();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to /pending when the profile isn't active", () => {
    useAuth.mockReturnValue({
      session: { access_token: "tok" },
      profile: { status: "pending", role: "worker" },
      loading: false,
    });

    renderProtected();

    expect(screen.getByText("Pending Page")).toBeInTheDocument();
  });

  it("renders the protected content for an active user", () => {
    useAuth.mockReturnValue({
      session: { access_token: "tok" },
      profile: { status: "active", role: "worker" },
      loading: false,
    });

    renderProtected();

    expect(screen.getByText("Secret Content")).toBeInTheDocument();
  });

  it("redirects a non-admin away from an adminOnly route", () => {
    useAuth.mockReturnValue({
      session: { access_token: "tok" },
      profile: { status: "active", role: "worker" },
      loading: false,
    });

    renderProtected({ adminOnly: true });

    expect(screen.getByText("Jobs Page")).toBeInTheDocument();
  });

  it("renders adminOnly content for an active admin", () => {
    useAuth.mockReturnValue({
      session: { access_token: "tok" },
      profile: { status: "active", role: "admin" },
      loading: false,
    });

    renderProtected({ adminOnly: true });

    expect(screen.getByText("Secret Content")).toBeInTheDocument();
  });
});
