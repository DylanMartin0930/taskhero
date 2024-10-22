import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import Dropdown from "@/components/ui/dropdown";
import React from "react";

describe("Dropdown", () => {
  it("should Have a button", () => {
    render(<Dropdown />);
    const button = screen.getByRole("button", { name: /dropdown/i });
    expect(button).toBeInTheDocument();
  });

  it("Should not initially display dropdown items", () => {
    render(<Dropdown />);
    expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/settings/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
  });

  it("should open the dropdown when the button is clicked", async () => {
    render(<Dropdown />);
    const button = screen.getByRole("button", { name: /dropdown/i });
    fireEvent.click(button);

    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it("should close the dropdown when the button is clicked", async () => {
    render(<Dropdown />);
    const button = screen.getByRole("button", { name: /dropdown/i });
    fireEvent.click(button);

    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/settings/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
  });

  it("should render correct links", async () => {
    render(<Dropdown />);
    const button = screen.getByRole("button", { name: /dropdown/i });
    fireEvent.click(button);

    const profileLink = screen.getByRole("link", { name: /profile/i });
    const settingsLink = screen.getByRole("link", { name: /settings/i });
    const logoutLink = screen.getByRole("link", { name: /logout/i });

    expect(profileLink).toHaveAttribute("href", "/profile");
    expect(settingsLink).toHaveAttribute("href", "/settings");
    expect(logoutLink).toHaveAttribute("href", "/logout");
  });
});
