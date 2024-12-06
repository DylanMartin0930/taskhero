import NewTask from "@/components/ui/newtask-dropdown";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the dependencies
vi.mock("@/components/queries/createTask", () => ({
  createTask: vi.fn(),
}));

// Create a mock context with a Provider component
vi.mock("@/components/context/DueSoonContext", () => ({
  useTaskContext: () => ({
    refreshTasks: vi.fn(),
  }),
  DueSoonbProvider: ({ children }) => children, // Mock the provider to simply render its children
}));

describe("NewTask Component", () => {
  const defaultProps = {
    defaultProject: null,
    folder: "Test Folder",
    onTaskCreated: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the New Task button", () => {
    render(<NewTask {...defaultProps} />);
    const button = screen.getByRole("button", { name: /new task/i });
    expect(button).toBeInTheDocument();
  });
});