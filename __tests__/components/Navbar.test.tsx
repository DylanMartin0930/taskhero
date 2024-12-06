import Navbar from "@/components/ui/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { beforeEach, describe, it, vi } from "vitest";

// Mock external dependencies
vi.mock("axios");
vi.mock("@/components/queries/fetchProjects", () => ({
  fetchProjects: vi.fn(),
}));

// Mock child components
vi.mock("@/components/ui/defaultoptions", () => ({
  default: () => <div data-testid="default-options">Default Options</div>,
}));

vi.mock("@/components/ui/dropdown", () => ({
  default: ({ userName }) => (
    <div data-testid="dropdown">Dropdown - User: {userName}</div>
  ),
}));

vi.mock("@/components/ui/newFolderProjects-button", () => ({
  default: () => <div data-testid="new-folder-button">New Folder/Projects Button</div>,
}));

vi.mock("@/components/ui/projectList", () => ({
  default: () => <div data-testid="project-list">Project List</div>,
}));

describe("Navbar", () => {
  const queryClient = new QueryClient();
  const mockSetOnRefresh = vi.fn();

  const renderWithProviders = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Navbar setOnRefresh={mockSetOnRefresh} />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the navbar with initial state", () => {
    renderWithProviders();
    expect(screen.getByText("TaskHero")).toBeInTheDocument();
  });

  it("toggles navbar visibility when menu button is clicked", () => {
    renderWithProviders();
    const menuButton = screen.getByTestId("nav-button");
    const title = screen.getByText("TaskHero");
    
    // Initial state - navbar should be visible
    expect(title).not.toHaveClass('hidden');
    
    // Click to collapse
    fireEvent.click(menuButton);
    expect(title).toHaveClass('hidden');
    
    // Click to expand
    fireEvent.click(menuButton);
    expect(title).not.toHaveClass('hidden');
  });

  it("fetches and displays user data", async () => {
    const mockUserData = {
      data: {
        data: {
          user: {
            username: "TestUser",
            encryptedUserId: "123"
          }
        }
      }
    };

    vi.mocked(axios.get).mockResolvedValueOnce(mockUserData);
    
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId("dropdown")).toHaveTextContent("TestUser");
    });
  });

  it("renders all child components when navbar is expanded", () => {
    renderWithProviders();
    
    expect(screen.getByTestId("default-options")).toBeInTheDocument();
    expect(screen.getByTestId("project-list")).toBeInTheDocument();
    expect(screen.getByTestId("new-folder-button")).toBeInTheDocument();
  });

  it("calls setOnRefresh with the refresh function", () => {
    renderWithProviders();
    expect(mockSetOnRefresh).toHaveBeenCalledTimes(1);
    expect(mockSetOnRefresh).toHaveBeenCalledWith(expect.any(Function));
  });

  it("handles error when fetching user data", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(axios.get).mockRejectedValueOnce(new Error("Failed to fetch"));
    
    renderWithProviders();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching user data:",
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});