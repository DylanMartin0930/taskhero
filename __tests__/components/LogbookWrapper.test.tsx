import { DueSoonbProvider } from "@/components/context/DueSoonContext";
import LogBookWrapper from "@/components/ui/logbookwrapper";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the toast library
vi.mock("react-hot-toast", () => ({
	default: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

// Import toast after the mock is defined
import toast from "react-hot-toast";

describe("LogBookWrapper", () => {
	// Mock data
	const mockTasks = [
		{ _id: "1", title: "Task 1" },
		{ _id: "2", title: "Task 2" },
	];

	// Mock fetch function
	const mockFetchCall = vi.fn();

	const renderWithProvider = (component) => {
		return render(<DueSoonbProvider>{component}</DueSoonbProvider>);
	};

	beforeEach(() => {
		// Clear all mocks before each test
		vi.clearAllMocks();
	});

	it("renders no tasks message when tasks array is empty", async () => {
		mockFetchCall.mockImplementation((projectId, setTasks) => setTasks([]));

		renderWithProvider(
			<LogBookWrapper
				projectId="123"
				fetchcall={mockFetchCall}
				writeperm={true}
			/>
		);

		await waitFor(() => {
			expect(screen.getByText("No tasks available.")).toBeInTheDocument();
		});
	});

	it("renders tasks when they exist", async () => {
		mockFetchCall.mockImplementation((projectId, setTasks) =>
			setTasks(mockTasks)
		);

		renderWithProvider(
			<LogBookWrapper
				projectId="123"
				fetchcall={mockFetchCall}
				writeperm={true}
			/>
		);

		await waitFor(() => {
			expect(mockFetchCall).toHaveBeenCalledWith("123", expect.any(Function));
			expect(toast.success).toHaveBeenCalledWith("project selected");
		});
	});

	it("shows error toast when no project is selected", async () => {
		renderWithProvider(
			<LogBookWrapper
				projectId={null}
				fetchcall={mockFetchCall}
				writeperm={true}
			/>
		);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith("No project selected");
		});
	});
});
