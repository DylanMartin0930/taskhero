import Dropdown from "@/components/ui/dropdown";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

// Mock USER_ITEMS
vi.mock("@/constants/useritems", () => ({
  USER_ITEMS: [
    { title: "Profile", path: "/profile" },
    { title: "Settings", path: "/settings" },
    { title: "Logout", path: "/logout" },
  ],
}));

describe("Dropdown Component", () => {
  const defaultProps = {
    userName: "John Doe",
    userId: "123",
  };

  it("renders the dropdown button with user name", () => {
    render(<Dropdown {...defaultProps} />);
    const button = screen.getByRole("button", { name: defaultProps.userName });
    expect(button).toBeInTheDocument();
  });

  it("initially renders with dropdown closed", () => {
    render(<Dropdown {...defaultProps} />);
    const dropdownMenu = screen.queryByRole("link", { name: /profile/i });
    expect(dropdownMenu).not.toBeInTheDocument();
  });

  it("opens dropdown menu when button is clicked", () => {
    render(<Dropdown {...defaultProps} />);
    const button = screen.getByRole("button", { name: defaultProps.userName });
    
    fireEvent.click(button);
    
    const profileLink = screen.getByRole("link", { name: /profile/i });
    const settingsLink = screen.getByRole("link", { name: /settings/i });
    const logoutLink = screen.getByRole("link", { name: /logout/i });
    
    expect(profileLink).toBeInTheDocument();
    expect(settingsLink).toBeInTheDocument();
    expect(logoutLink).toBeInTheDocument();
  });

  it("closes dropdown menu when button is clicked again", () => {
    render(<Dropdown {...defaultProps} />);
    const button = screen.getByRole("button", { name: defaultProps.userName });
    
    // Open dropdown
    fireEvent.click(button);
    // Close dropdown
    fireEvent.click(button);
    
    const dropdownMenu = screen.queryByRole("link", { name: /profile/i });
    expect(dropdownMenu).not.toBeInTheDocument();
  });

  it("renders correct href for non-logout links with userId", () => {
    render(<Dropdown {...defaultProps} />);
    const button = screen.getByRole("button", { name: defaultProps.userName });
    fireEvent.click(button);

    const profileLink = screen.getByRole("link", { name: /profile/i });
    const settingsLink = screen.getByRole("link", { name: /settings/i });

    expect(profileLink).toHaveAttribute("href", `/profile${defaultProps.userId}`);
    expect(settingsLink).toHaveAttribute("href", `/settings${defaultProps.userId}`);
  });

  it("renders correct href for logout link without userId", () => {
    render(<Dropdown {...defaultProps} />);
    const button = screen.getByRole("button", { name: defaultProps.userName });
    fireEvent.click(button);

    const logoutLink = screen.getByRole("link", { name: /logout/i });
    expect(logoutLink).toHaveAttribute("href", "/logout");
  });

  it("applies correct styling classes when dropdown is open", () => {
    render(<Dropdown {...defaultProps} />);
    const button = screen.getByRole("button", { name: defaultProps.userName });
    fireEvent.click(button);

    const dropdownContainer = screen.getByRole("link", { name: /profile/i })
      .closest("div");
    expect(dropdownContainer?.parentElement).toHaveClass("h-auto", "opacity-100");
  });

  it("applies correct styling classes when dropdown is closed", () => {
    render(<Dropdown {...defaultProps} />);
    const dropdownElement = document.querySelector('[class*="transition-all"]');
    expect(dropdownElement).toHaveClass("h-0", "opacity-0");
  });
});