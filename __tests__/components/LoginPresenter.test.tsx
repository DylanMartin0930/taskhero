import { fireEvent, render, screen } from "@testing-library/react";
import LoginPagePresenter from "@/components/LoginPresenter";
import React from "react";

describe("LoginPagePresenter", () => {
  const result = {
    current: {
      loading: false,
      user: { email: "", password: "" }, // Initial state of the user object
      setUser: vi.fn(), // Mock function to track calls
      buttonDisabled: true, // Assume button is disabled initially
    },
  };

  const mockOnLogin = vi.fn(); // Mock function for onLogin

  it("Should render input fields for Email and Password with correct placeholders", () => {
    render(
      <LoginPagePresenter
        loading={result.current.loading}
        user={result.current.user}
        setUser={result.current.setUser}
        onLogin={mockOnLogin}
        buttonDisabled={result.current.buttonDisabled}
      />,
    );

    const emailField = screen.getByPlaceholderText("Email");
    const passwordField = screen.getByPlaceholderText("Password");

    expect(emailField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
  });

  it("Should allow user input for Email and Password", () => {
    render(
      <LoginPagePresenter
        loading={result.current.loading}
        user={result.current.user}
        setUser={result.current.setUser}
        onLogin={mockOnLogin}
        buttonDisabled={result.current.buttonDisabled}
      />,
    );

    const emailField = screen.getByPlaceholderText(/email/i);
    const passwordField = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailField, { target: { value: "test@example.com" } });
    fireEvent.change(passwordField, { target: { value: "password123" } });

    expect(result.current.setUser).toHaveBeenCalledWith({
      ...result.current.user,
      email: "test@example.com",
    });
    expect(result.current.setUser).toHaveBeenCalledWith({
      ...result.current.user,
      password: "password123",
    });
  });

  it("Should render a login button with appropriate state", () => {
    render(
      <LoginPagePresenter
        loading={result.current.loading}
        user={result.current.user}
        setUser={result.current.setUser}
        onLogin={mockOnLogin}
        buttonDisabled={result.current.buttonDisabled}
      />,
    );

    const button = screen.getByRole("button", { name: /missing field/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("Should call onLogin when the login button is clicked and enabled", () => {
    render(
      <LoginPagePresenter
        loading={result.current.loading}
        user={{ email: "test@example.com", password: "password123" }}
        setUser={result.current.setUser}
        onLogin={mockOnLogin}
        buttonDisabled={false} // Button is enabled
      />,
    );

    const button = screen.getByRole("button", { name: /login/i });
    fireEvent.click(button);

    expect(mockOnLogin).toHaveBeenCalled();
  });

  it("Should render a link to the signup page", () => {
    render(
      <LoginPagePresenter
        loading={result.current.loading}
        user={result.current.user}
        setUser={result.current.setUser}
        onLogin={mockOnLogin}
        buttonDisabled={result.current.buttonDisabled}
      />,
    );

    const link = screen.getByRole("link", { name: /visit signup page/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/signup");
  });

  it("Should display the Task Hero title and description", () => {
    render(
      <LoginPagePresenter
        loading={result.current.loading}
        user={result.current.user}
        setUser={result.current.setUser}
        onLogin={mockOnLogin}
        buttonDisabled={result.current.buttonDisabled}
      />,
    );

    const title = screen.getByText("Task Hero");
    const description = screen.getByText(/unleash your productivity/i);

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });
});
