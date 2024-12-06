import NewFolderProjectsButton from "@/components/ui/newFolderProjects-button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock axios and next/navigation
vi.mock("axios");
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("NewFolderProjectsButton", () => {
  const mockOnRefresh = vi.fn();
  let consoleLogSpy: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up console.log spy before each test
    consoleLogSpy = vi.spyOn(console, 'log');
  });

  afterEach(() => {
    // Clean up console.log spy after each test
    consoleLogSpy.mockRestore();
  });

  it("renders the Create New button", () => {
    render(<NewFolderProjectsButton onRefresh={mockOnRefresh} />);
    const button = screen.getByRole("button", { name: /create new/i });
    expect(button).toBeInTheDocument();
  });

  it("shows dropdown when button is clicked", () => {
    render(<NewFolderProjectsButton onRefresh={mockOnRefresh} />);
    
    // Click the main button
    const button = screen.getByRole("button", { name: /create new/i });
    fireEvent.click(button);
    
    // Check if Project option appears
    const projectButton = screen.getByRole("button", { name: /project/i });
    expect(projectButton).toBeInTheDocument();
  });

  it("hides dropdown when button is clicked again", () => {
    render(<NewFolderProjectsButton onRefresh={mockOnRefresh} />);
    
    // Click to open
    const button = screen.getByRole("button", { name: /create new/i });
    fireEvent.click(button);
    
    // Click to close
    fireEvent.click(button);
    
    // Check if Project option is hidden
    const projectButton = screen.queryByRole("button", { name: /project/i });
    expect(projectButton).not.toBeInTheDocument();
  });

  it("creates a project successfully", async () => {
    const mockResponse = {
      data: {
        data: {
          title: "New Project",
          encryptedId: "123",
        },
      },
    };

    vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);
    
    render(<NewFolderProjectsButton onRefresh={mockOnRefresh} />);
    
    // Open dropdown and click Project button
    fireEvent.click(screen.getByRole("button", { name: /create new/i }));
    fireEvent.click(screen.getByRole("button", { name: /project/i }));

    await waitFor(() => {
      // Check if axios.post was called with correct endpoint
      expect(axios.post).toHaveBeenCalledWith("/api/projects/createProject");
      
      // Check if onRefresh was called
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });

  it("handles project creation error", async () => {
    const errorMessage = "Failed to create project";
    vi.mocked(axios.post).mockRejectedValueOnce(new Error(errorMessage));
    
    render(<NewFolderProjectsButton onRefresh={mockOnRefresh} />);
    
    // Open dropdown and click Project button
    fireEvent.click(screen.getByRole("button", { name: /create new/i }));
    fireEvent.click(screen.getByRole("button", { name: /project/i }));

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith(errorMessage);
    });
  });

  it("applies correct styling to the dropdown", () => {
    render(<NewFolderProjectsButton onRefresh={mockOnRefresh} />);
    
    // Click to open dropdown
    fireEvent.click(screen.getByRole("button", { name: /create new/i }));
    
    const dropdown = screen.getByRole("button", { name: /project/i }).parentElement;
    expect(dropdown).toHaveClass("z-40", "top-full", "bg-white", "text-black");
  });
});