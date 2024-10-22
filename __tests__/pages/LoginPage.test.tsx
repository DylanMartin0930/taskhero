import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "../../src/app/login/page";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";
import { Toaster } from "react-hot-toast";
import { setTimeout } from "timers/promises";
import RootLayout from "@/app/layout";

vi.mock("axios");
vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));
describe("LoginPage", () => {
  it("Render button with 'Missing Fields' Email & Password values", () => {
    render(<LoginPage />);

    const button = screen.getByRole("button");

    //no user input
    expect(button).toHaveTextContent("Missing Field");

    //only email input
    const emailInput = screen.getByPlaceholderText(/email/i);

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    expect(button).toHaveTextContent("Missing Field");

    //only password input
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });
    expect(button).toHaveTextContent("Missing Field");
  });

  it("Render button with 'Login' with both Email & Password values", () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Login");
  });

  it("Should call onLogin function when the Enabled button is clicked", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });

    const button = screen.getByRole("button", { name: "Login" });
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  it("Should Unlock Login Button & Make axios call with user email and password input", async () => {
    render(<LoginPage />);

    //Rechecking input field attributes would be reduntant, not necessary here
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });

    //will FAIL if email and password are not entered
    const button = screen.getByRole("button", { name: "Login" });
    fireEvent.click(button);

    /*
    Normal axios call wouldnt work due to external dependencies (mongodb,
    MailTrap etc) so we mock the axios call to simulate the call and check
    the values being passed
    */
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/users/login", {
        email: "test@gmail.com",
        password: "1234",
      });
    });
  });
});
