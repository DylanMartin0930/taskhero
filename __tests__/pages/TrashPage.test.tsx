import { fetchTasks } from "@/components/queries/fetchTasks";
import { getProjectInfo } from "@/components/queries/getProjectInfo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TrashPage from "../../src/app/dashboard/trash/[trash]/page";

// Mock the required modules
vi.mock("@/components/queries/getProjectInfo");
vi.mock("@/components/queries/fetchTasks");
vi.mock("@/components/ui/tasklistwrapper", () => ({
	default: ({ projectId, fetchcall, writeperm }) => (
		<div data-testid="tasklist-wrapper">
			TaskList Wrapper (ProjectID: {projectId}, WritePermission:{" "}
			{String(writeperm)})
		</div>
	),
}));
vi.mock("react-hot-toast", () => ({
	default: {
		error: vi.fn(),
		success: vi.fn(),
	},
}));

describe("TrashPage", () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	beforeEach(() => {
		vi.clearAllMocks();
		queryClient.clear(); // Clear the query cache

		// Mock window.location
		delete window.location;
		window.location = {
			search: "?token=test-token",
		} as unknown as Location;
	});

	const renderWithProviders = () => {
		return render(
			<QueryClientProvider client={queryClient}>
				<TrashPage params={{}} />
			</QueryClientProvider>
		);
	};

	it("renders loading state initially", () => {
		vi.mocked(getProjectInfo).mockReturnValueOnce(new Promise(() => {})); // Never resolves
		renderWithProviders();
		expect(screen.getByText(/loading, please wait/i)).toBeInTheDocument();
	});

	it("renders project information when data is loaded", async () => {
		const mockProjectInfo = {
			title: "Trash Project",
		};

		vi.mocked(getProjectInfo).mockResolvedValueOnce(mockProjectInfo);

		renderWithProviders();

		await waitFor(() => {
			expect(screen.getByText("Trash Project")).toBeInTheDocument();
		});

		// Verify TaskListWrapper is rendered with correct props
		const tasklistWrapper = screen.getByTestId("tasklist-wrapper");
		expect(tasklistWrapper).toBeInTheDocument();
		expect(tasklistWrapper).toHaveTextContent("ProjectID: test-token");
		expect(tasklistWrapper).toHaveTextContent("WritePermission: false");
	});

	it("shows loading state when no project info is available", async () => {
		vi.mocked(getProjectInfo).mockResolvedValueOnce(null);

		renderWithProviders();

		await waitFor(() => {
			const heading = screen.getByRole("heading", { level: 1 });
			expect(heading).toHaveTextContent("Loading...");
		});
	});

	it("updates token from URL parameters", async () => {
		const mockProjectInfo = {
			title: "Trash Project",
		};

		vi.mocked(getProjectInfo).mockResolvedValueOnce(mockProjectInfo);

		renderWithProviders();

		await waitFor(() => {
			const tasklistWrapper = screen.getByTestId("tasklist-wrapper");
			expect(tasklistWrapper).toHaveTextContent("ProjectID: test-token");
		});
	});
});
