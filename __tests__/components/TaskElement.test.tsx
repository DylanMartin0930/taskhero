import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskElement from "@/components/ui/taskelement";
import { completeTask } from "@/components/queries/completeTask";
import { deleteTasks } from "@/components/queries/deleteTask";

// Mock functions
vi.mock("@/components/queries/completeTask", () => ({
  completeTask: vi.fn(),
}));

vi.mock("@/components/queries/deleteTask", () => ({
  deleteTasks: vi.fn(),
}));

describe("TaskElement", () => {
  const task = {
    _id: "123",
    title: "Sample Task",
    description: "This is a sample task description",
    folder: "Sample Folder",
    completed: false,
    dueDate: new Date("2022-11-04"),
    assignedDate: new Date("2022-11-04"),
  };

  const taskMinusDates = {
    _id: "123",
    title: "Sample Task",
    description: "This is a sample task description",
    folder: "Sample Folder",
    completed: false,
    dueDate: null,
    assignedDate: null,
  };

  const onToggle = vi.fn();
  const onRefresh = vi.fn();

  it("renders task title and checkbox", () => {
    render(
      <TaskElement
        task={task}
        isOpen={false}
        onToggle={onToggle}
        onRefresh={onRefresh}
      />,
    );
    const title = screen.getByRole("heading", { name: "Sample Task" });
    expect(title).toBeInTheDocument();
  });

  it("shows task details when isOpen is true", () => {
    render(
      <TaskElement
        task={task}
        isOpen={true}
        onToggle={onToggle}
        onRefresh={onRefresh}
      />,
    );

    // Check if details are displayed
    const description = screen.getByText("This is a sample task description");
    const folder = screen.getByText(/folder/i);
    const dueDate = screen.getByText(/deadline/i);
    const assignedDate = screen.getByText(/assigned/i);

    expect(description).toBeInTheDocument();
    expect(folder).toBeInTheDocument();
    expect(dueDate).toBeInTheDocument();
    expect(assignedDate).toBeInTheDocument();
  });

  it("should not show due or assigned date if null", () => {
    render(
      <TaskElement
        task={taskMinusDates}
        isOpen={true}
        onToggle={onToggle}
        onRefresh={onRefresh}
      />,
    );

    // Check if details are displayed
    const dueDate = screen.queryByText(/deadline/i);
    const assignedDate = screen.queryByText(/assigned/i);

    expect(dueDate).not.toBeInTheDocument();
    expect(assignedDate).not.toBeInTheDocument();
  });

  it("calls onToggle on double-click", () => {
    render(
      <TaskElement
        task={task}
        isOpen={false}
        onToggle={onToggle}
        onRefresh={onRefresh}
      />,
    );

    // Double-click on the task element
    fireEvent.doubleClick(screen.getByText("Sample Task"));

    // Check if onToggle was called
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("calls completeTask on checkbox click", async () => {
    render(
      <TaskElement
        task={task}
        isOpen={false}
        onToggle={onToggle}
        onRefresh={onRefresh}
      />,
    );

    // Click on the checkbox
    fireEvent.click(screen.getByRole("checkbox"));

    // Check if completeTask was called with correct arguments
    await expect(completeTask).toHaveBeenCalledWith("123", onRefresh);
  });

  it("calls deleteTasks on delete button click", async () => {
    render(
      <TaskElement
        task={task}
        isOpen={true}
        onToggle={onToggle}
        onRefresh={onRefresh}
      />,
    );

    // Click the delete button
    fireEvent.click(screen.getByRole("button"));

    // Check if deleteTasks was called with correct arguments
    await waitFor(() => {
      expect(deleteTasks).toHaveBeenCalledWith("123", onRefresh);
    });
  });
});
