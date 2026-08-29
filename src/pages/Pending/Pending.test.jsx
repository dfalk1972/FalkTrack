import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Pending from "./Pending";
import { useAuth } from "../../context/AuthContext";

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

function renderPending() {
  return render(
    <MemoryRouter>
      <Pending />
    </MemoryRouter>
  );
}

describe("Pending", () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  it("navigates to /login after logging out", async () => {
    // Regression test for the "Log Out button does nothing" bug -
    // logout() itself was always working, but nothing navigated away
    // afterward, so the page just sat there unchanged.
    const logoutMock = vi.fn().mockResolvedValue({ error: null });
    useAuth.mockReturnValue({ logout: logoutMock });
    const user = userEvent.setup();

    renderPending();

    await user.click(screen.getByRole("button", { name: /log out/i }));

    expect(logoutMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});
