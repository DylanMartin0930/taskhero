import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import NewTask from "@/components/ui/newtask-dropdown";
import React from "react";

describe("New Task Dropdown", () => {
  const onTaskCreated = vi.fn();
  it("should initially display a button ", () => {
    render(<NewTask onTaskCreated={onTaskCreated} />);
    const button = screen.getByRole("button", { name: /new task/i });
    expect(button).toBeInTheDocument();
  });

  it("should show input fields on click", () => {
    render(<NewTask onTaskCreated={onTaskCreated} />);
    const button = screen.getByRole("button", { name: /new task/i });
    fireEvent.click(button);

    const titleInput = screen.getByPlaceholderText(/title/i);
    const descriptionInput = screen.getByPlaceholderText(/description/i);
    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
  });

  it("should show date pickers on click", () => {
    render(<NewTask onTaskCreated={onTaskCreated} />);
    const button = screen.getByRole("button", { name: /new task/i });
    fireEvent.click(button);

    const dueDateInput = screen.getByPlaceholderText(/due date/i);
    const assignedDateInput = screen.getByPlaceholderText(/assigned date/i);
    expect(dueDateInput).toBeInTheDocument();
    expect(assignedDateInput).toBeInTheDocument();
  });
});
