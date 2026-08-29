import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { supabase } from "../../supabaseClient";

// Fakes the frontend Supabase client so no real network call happens -
// Login talks to Supabase Auth directly (see its own comments), so this
// is the boundary that needs faking here.
vi.mock("../../supabaseClient", () => ({
  supabase: { auth: { signInWithPassword: vi.fn() } },
}));

// react-router's useNavigate needs a real Router context to work at
// all, but we still want to intercept the actual navigate() CALL to
// assert on it - so keep everything else from react-router-dom real
// and only override useNavigate.
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe("Login", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    supabase.auth.signInWithPassword.mockReset();
  });

  it("renders email and password fields", () => {
    renderLogin();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("shows Supabase's error message and does not navigate on a failed login", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: "Invalid login credentials" },
    });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(
      await screen.findByText("Invalid login credentials")
    ).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("navigates to /jobs after a successful login", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "correctpassword");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/jobs"));
  });
});
