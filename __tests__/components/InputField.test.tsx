import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import InputField from "../../src/components/InputField";
import React from "react";
import userEvent from "@testing-library/user-event";

describe("InputField", () => {
  const { result } = renderHook(() => {
    const [user, setUser] = React.useState({
      email: "",
      password: "",
    });
    return { user, setUser };
  });

  it("should render an input field with email attributes", () => {
    render(
      <InputField
        formType={"text"}
        user={result.current.user}
        setUser={result.current.setUser}
        idType={"email"}
      />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("placeholder", "email");
  });

  it("should render an input field with Password attributes", () => {
    render(
      <InputField
        formType={"password"}
        user={result.current.user}
        setUser={result.current.setUser}
        idType={"password"}
      />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("id", "password");
    expect(input).toHaveAttribute("placeholder", "password");
  });

  it("should update the user email when the input field is changed", async () => {
    const setUser = vi.fn();
    const user = { email: "" };
    const idType = "email";

    render(
      <InputField
        formType="email"
        user={user}
        setUser={setUser}
        idType={idType}
      />,
    );

    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, {
      target: { value: "new-email@example.com" },
    });

    expect(setUser).toHaveBeenCalledWith({
      ...user,
      [idType]: "new-email@example.com",
    });
  });

  it("should update the user Password when the input field is changed", async () => {
    const setUser = vi.fn();
    const user = { password: "" };
    const idType = "password";

    render(
      <InputField
        formType="password"
        user={user}
        setUser={setUser}
        idType={idType}
      />,
    );

    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, {
      target: { value: "1234" },
    });

    expect(setUser).toHaveBeenCalledWith({
      ...user,
      [idType]: "1234",
    });
  });
});
