import { DueSoonbProvider } from "@/components/context/DueSoonContext";
import { GraphProvider } from "@/components/context/GraphContext";
import { UserProvider } from "@/components/context/UserContext";
import { completeTask } from "@/components/queries/completeTask";
import { deleteTasks } from "@/components/queries/deleteTask";
import { updateTask } from "@/components/queries/updateTask";
import TaskElement from "@/components/ui/taskelement";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the required functions and modules
vi.mock("@/components/queries/completeTask", () => ({
  completeTask: vi.fn(),
}));

vi.mock("@/components/queries/deleteTask", () => ({
  deleteTasks: vi.fn(),
}));

vi.mock("@/components/queries/updateTask", () => ({
  updateTask: vi.fn(),
}));

describe("TaskElement", () => {
  const mockTask = {
    _id: "123",
    title: "Test Task",
    description: "Test Description",
    folder: "Test Folder",
    completed: false,
    dueDate: "2024-03-20T00:00:00.000Z",
    assignedDate: "2024-03-19T00:00:00.000Z",
    parent: "Test Parent",
  };

  const mockOnRefresh = vi.fn();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const renderWithProviders = (component) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <GraphProvider>
            <DueSoonbProvider>{component}</DueSoonbProvider>
          </GraphProvider>
        </UserProvider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("renders task title and basic information", () => {
    renderWithProviders(
      <TaskElement task={mockTask} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Folder")).toBeInTheDocument();
  });

  it("toggles expanded view when clicked", () => {
    renderWithProviders(
      <TaskElement task={mockTask} onRefresh={mockOnRefresh} />
    );

    const taskContainer = screen.getByText("Test Task").closest("div");
    fireEvent.click(taskContainer);

    expect(screen.getByText("Test Description")).toBeVisible();
  });

  it("enters edit mode when edit button is clicked", async () => {
    renderWithProviders(
      <TaskElement task={mockTask} onRefresh={mockOnRefresh} />
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    const titleInput = screen.getByDisplayValue("Test Task");
    const descriptionInput = screen.getByDisplayValue("Test Description");

    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
  });

  it("handles task completion", async () => {
    renderWithProviders(
      <TaskElement task={mockTask} onRefresh={mockOnRefresh} />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(completeTask).toHaveBeenCalledWith(
        expect.any(String),
        mockTask,
        mockOnRefresh,
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
        expect.any(Function)
      );
    });
  });

  it("handles task deletion", async () => {
    renderWithProviders(
      <TaskElement task={mockTask} onRefresh={mockOnRefresh} />
    );

    // First click to expand the task
    const taskContainer = screen.getByText("Test Task").closest("div");
    fireEvent.click(taskContainer);

    // Use getByTestId to find the delete button
    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(vi.mocked(deleteTasks)).toHaveBeenCalledWith(
        expect.any(String),
        mockTask._id,
        mockOnRefresh,
        expect.any(Function)
      );
    });
  });

  it("formats dates correctly", () => {
    renderWithProviders(
      <TaskElement task={mockTask} onRefresh={mockOnRefresh} />
    );

    const formattedDueDate = screen.getByText(/wednesday, march 20/i);
    const formattedAssignedDate = screen.getByText(/tuesday, march 19/i);

    expect(formattedDueDate).toBeInTheDocument();
    expect(formattedAssignedDate).toBeInTheDocument();
  });

  it("saves edited task information", async () => {
    renderWithProviders(
      <TaskElement task={mockTask} onRefresh={mockOnRefresh} />
    );

    // Enter edit mode
    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    // Edit title
    const titleInput = screen.getByDisplayValue("Test Task");
    fireEvent.change(titleInput, { target: { value: "Updated Task" } });

    // Save changes
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Updated Task",
        }),
        mockTask,
        null,
        mockOnRefresh,
        expect.any(Function)
      );
    });
  });
});