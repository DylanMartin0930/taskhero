import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "../../src/app/login/page";
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
describe("LoginPage", () => {
  it("Render button with 'Missing Fields' Email & Password values", () => {
    render(<LoginPage />);

    const button = screen.getByRole("button");

    //no user input
    expect(button).toHaveTextContent("Missing Field");

    //only email input
    const emailInput = screen.getByRole("textbox", { name: "Email" });

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    expect(button).toHaveTextContent("Missing Field");

    //only password input
    const passwordInput = screen.getByRole("textbox", { name: "Password" });

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });
    expect(button).toHaveTextContent("Missing Field");
  });

  it("Render button with 'Login' with both Email & Password values", () => {
    render(<LoginPage />);

    const emailInput = screen.getByRole("textbox", { name: "Email" });
    const passwordInput = screen.getByRole("textbox", { name: "Password" });

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Login");
  });

  it("Should call onLogin function when the Enabled button is clicked", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByRole("textbox", { name: "Email" });
    const passwordInput = screen.getByRole("textbox", { name: "Password" });

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });

    const button = screen.getByRole("button", { name: "Login" });
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
});
