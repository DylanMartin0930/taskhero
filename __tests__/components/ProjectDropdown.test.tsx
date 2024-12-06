import { fetchWritableProjects } from "@/components/queries/fetchWritableProjects";
import ProjectDropDown from "@/components/ui/projects-dropdown";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the dependencies
vi.mock("@/components/queries/fetchWritableProjects");
vi.mock("react-hot-toast", () => ({
	__esModule: true,
	default: {
		error: vi.fn(),
		success: vi.fn(),
	},
}));

describe("ProjectDropDown", () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				retryDelay: 1,
			},
		},
	});

	const mockProjects = [
		{ _id: "1", title: "Project 1" },
		{ _id: "2", title: "Project 2" },
	];

	const defaultProps = {
		setSelectedProject: vi.fn(),
	};

	const renderWithProviders = () => {
		return render(
			<QueryClientProvider client={queryClient}>
				<ProjectDropDown {...defaultProps} />
			</QueryClientProvider>
		);
	};

	beforeEach(() => {
		vi.clearAllMocks();
		queryClient.clear();
	});

	it("renders the dropdown button with default text", () => {
		renderWithProviders();
		const button = screen.getByRole("button");
		expect(button).toHaveTextContent("Assign to project");
	});

	it("shows loading state initially when clicked", async () => {
		vi.mocked(fetchWritableProjects).mockImplementationOnce(
			() =>
				new Promise((resolve) => setTimeout(() => resolve(mockProjects), 100))
		);

		renderWithProviders();

		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("shows project list when clicked and data is loaded", async () => {
		vi.mocked(fetchWritableProjects).mockResolvedValueOnce(mockProjects);
		renderWithProviders();

		const button = screen.getByRole("button");
		fireEvent.click(button);

		// Wait for loading to complete and projects to appear
		await waitFor(() => {
			expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
		});

		// Check if all projects are rendered
		mockProjects.forEach((project) => {
			expect(screen.getByText(project.title)).toBeInTheDocument();
		});
	});

	it("shows no projects message when project list is empty", async () => {
		vi.mocked(fetchWritableProjects).mockResolvedValueOnce([]);
		renderWithProviders();

		const button = screen.getByRole("button");
		fireEvent.click(button);

		await waitFor(() => {
			expect(screen.getByText("No projects available")).toBeInTheDocument();
		});
	});

	it("updates selected project when a project is clicked", async () => {
		vi.mocked(fetchWritableProjects).mockResolvedValueOnce(mockProjects);
		renderWithProviders();

		// Open dropdown
		const button = screen.getByRole("button");
		fireEvent.click(button);

		// Click a project
		await waitFor(() => {
			const projectOption = screen.getByText("Project 1");
			fireEvent.click(projectOption);
		});

		// Check if setSelectedProject was called with correct ID
		expect(defaultProps.setSelectedProject).toHaveBeenCalledWith("1");

		// Check if the button text updated
		expect(button).toHaveTextContent("Project 1");
	});

	it("toggles dropdown visibility when clicking the button", async () => {
		vi.mocked(fetchWritableProjects).mockResolvedValueOnce(mockProjects);
		renderWithProviders();

		const button = screen.getByRole("button");

		// Initially closed
		expect(screen.queryByText("Project 1")).not.toBeInTheDocument();

		// Open dropdown
		fireEvent.click(button);
		await waitFor(() => {
			expect(screen.getByText("Project 1")).toBeInTheDocument();
		});

		// Close dropdown
		fireEvent.click(button);
		expect(screen.queryByText("Project 1")).not.toBeInTheDocument();
	});

	it("changes arrow icon based on dropdown state", () => {
		renderWithProviders();

		const button = screen.getByRole("button");

		// Initially shows right arrow
		expect(screen.getByTestId("arrow-right")).toBeInTheDocument();

		// Shows down arrow when opened
		fireEvent.click(button);
		expect(screen.getByTestId("arrow-down")).toBeInTheDocument();
	});
});
