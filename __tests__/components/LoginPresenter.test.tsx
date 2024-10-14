import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import LoginPresenter from "../../src/components/LoginPresenter";
import React from "react";

describe("LoginPresenter", () => {
  const result = {
    current: {
      loading: false,
      user: { email: "", password: "" }, // Initial state of the user object
      setUser: vi.fn(),
      buttonDisabled: true, // Assume button is disabled initially
    },
  };

  const mockOnLogin = vi.fn();

  it("Should render headers for Email and Password", () => {
    render(
      <LoginPresenter
        loading={result.current.loading}
        user={result.current.user}
        setUser={result.current.setUser}
        onLogin={mockOnLogin}
        buttonDisabled={result.current.buttonDisabled}
      />,
    );

    const emailHeader = screen.getByText("Email");
    const passwordHeader = screen.getByText("Password");
    expect(emailHeader).toBeInTheDocument();
    expect(passwordHeader).toBeInTheDocument();
  });

  it("Should render Input fields for both Email and Password", () => {
    render(
      <LoginPresenter
        loading={result.current.loading}
        user={result.current.user}
        setUser={result.current.setUser}
        onLogin={mockOnLogin}
        buttonDisabled={result.current.buttonDisabled}
      />,
    );

    const emailHeader = screen.getByRole("textbox", { name: "Email" });
    const passwordHeader = screen.getByRole("textbox", { name: "Password" });
    expect(emailHeader).toBeInTheDocument();
    expect(passwordHeader).toBeInTheDocument();
  });

  it("Should render a link to signup page", () => {
    render(
      <LoginPresenter
        loading={result.current.loading}
        user={result.current.user}
        setUser={result.current.setUser}
        onLogin={mockOnLogin}
        buttonDisabled={result.current.buttonDisabled}
      />,
    );

    const link = screen.getByRole("link", { name: "Visit Signup Page" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/signup");
  });
});
