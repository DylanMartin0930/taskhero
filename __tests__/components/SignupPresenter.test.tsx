import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import SignUpPresenter from "../../src/components/SignUpPresenter";
import React from "react";

describe("LoginPresenter", () => {
  const result = {
    current: {
      loading: false,
      user: { email: "", password: "", username: "" }, // Initial state of the user object
      setUser: vi.fn(),
      buttonDisabled: true, // Assume button is disabled initially
    },
  };

  const mockOnLogin = vi.fn();

  it("Should render headers for Email, Username, and Password", () => {
    render(
      <SignUpPresenter
        loading={result.current.loading}
        user={result.current.user}
        setUser={result.current.setUser}
        onLogin={mockOnLogin}
        buttonDisabled={result.current.buttonDisabled}
      />,
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const usernameInput = screen.getByPlaceholderText(/username/i);
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
  });

  it("Should render Input fields for both Email, Username, and Password", () => {
    render(
      <SignUpPresenter
        loading={result.current.loading}
        user={result.current.user}
        setUser={result.current.setUser}
        onLogin={mockOnLogin}
        buttonDisabled={result.current.buttonDisabled}
      />,
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const usernameInput = screen.getByPlaceholderText(/username/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
  });

  it("Should render a link to signup Login page", () => {
    render(
      <SignUpPresenter
        loading={result.current.loading}
        user={result.current.user}
        setUser={result.current.setUser}
        onLogin={mockOnLogin}
        buttonDisabled={result.current.buttonDisabled}
      />,
    );

    const link = screen.getByRole("link", { name: "Visit Login Page" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/login");
  });
});
