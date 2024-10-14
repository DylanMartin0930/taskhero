import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignUpPage from "../../src/app/signup/page";
import userEvent from "@testing-library/user-event";
import axios from "axios";

vi.mock("axios");
vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));
describe("SignUpPage", () => {
  it("Render button with 'Missing Fields' Email & Password values", () => {
    render(<SignUpPage />);

    const button = screen.getByRole("button");

    //no user input
    expect(button).toHaveTextContent("Missing Field");

    //only email input
    const emailInput = screen.getByRole("textbox", { name: "Email" });

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    expect(button).toHaveTextContent("Missing Field");

    //only email & username input
    const usernameInput = screen.getByRole("textbox", { name: "Username" });
    fireEvent.change(usernameInput, { target: { value: "test" } });
    expect(button).toHaveTextContent("Missing Field");

    //only password input
    const passwordInput = screen.getByRole("textbox", { name: "Password" });

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });
    expect(button).toHaveTextContent("Missing Field");
  });

  it("Render button with 'SignUp' with both Email & Password values", () => {
    render(<SignUpPage />);

    const emailInput = screen.getByRole("textbox", { name: "Email" });
    const passwordInput = screen.getByRole("textbox", { name: "Password" });
    const usernameInput = screen.getByRole("textbox", { name: "Username" });

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });
    fireEvent.change(usernameInput, { target: { value: "test" } });

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Sign Up");
  });

  it("Should call onLogin function when the Enabled button is clicked", async () => {
    render(<SignUpPage />);

    const emailInput = screen.getByRole("textbox", { name: "Email" });
    const passwordInput = screen.getByRole("textbox", { name: "Password" });
    const usernameInput = screen.getByRole("textbox", { name: "Username" });

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });
    fireEvent.change(usernameInput, { target: { value: "test" } });

    const button = screen.getByRole("button", { name: "Sign Up" });
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
});
