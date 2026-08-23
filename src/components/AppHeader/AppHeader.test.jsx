import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppHeader from "./AppHeader";
import { useAuth } from "../../context/AuthContext";

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

function renderHeader(profile) {
  useAuth.mockReturnValue({ logout: vi.fn(), profile });
  return render(
    <MemoryRouter>
      <AppHeader />
    </MemoryRouter>
  );
}

describe("AppHeader", () => {
  it("shows the Admin link for an admin", () => {
    renderHeader({ role: "admin" });

    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("does not show the Admin link for a worker", () => {
    renderHeader({ role: "worker" });

    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("always shows the Jobs and Assets links", () => {
    renderHeader({ role: "worker" });

    expect(screen.getByText("Jobs")).toBeInTheDocument();
    expect(screen.getByText("Assets")).toBeInTheDocument();
  });
});
