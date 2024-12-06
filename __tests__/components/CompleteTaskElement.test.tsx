import { DueSoonbProvider } from "@/components/context/DueSoonContext";
import { archiveTask } from "@/components/queries/archiveTask";
import { recoverTask } from "@/components/queries/recoverTask";
import CompleteTaskElement from "@/components/ui/complete-task-element";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Update the mock setup
const mockArchiveTask = vi.fn();
const mockRecoverTask = vi.fn();

vi.mock("@/components/queries/archiveTask", () => ({
	archiveTask: vi.fn(),
}));

vi.mock("@/components/queries/recoverTask", () => ({
	recoverTask: vi.fn(),
}));

vi.mock("../../src/context/DueSoonContext", () => ({
	useTaskContext: () => ({
		refreshTasks: vi.fn(),
	}),
}));

describe("CompleteTaskElement", () => {
	const mockTask = {
		id: "1",
		title: "Test Task",
		description: "Test Description",
		folder: "Test Folder",
		dueDate: "2024-03-20",
		completeDate: "2024-03-19",
	};

	const mockProps = {
		task: mockTask,
		currentProjectId: "123",
		onRefresh: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		// Get reference to the mocked functions
		(archiveTask as any).mockImplementation(mockArchiveTask);
		(recoverTask as any).mockImplementation(mockRecoverTask);
	});

	const renderWithProvider = (props: any) => {
		return render(
			<DueSoonbProvider>
				<CompleteTaskElement {...props} />
			</DueSoonbProvider>
		);
	};

	it("renders task title correctly", () => {
		renderWithProvider(mockProps);
		expect(screen.getByText("Test Task")).toBeInTheDocument();
	});

	it("toggles content visibility when clicked", () => {
		renderWithProvider(mockProps);

		// Initially, description should not be visible
		expect(screen.queryByText("Test Description")).not.toBeInTheDocument();

		// Click to expand
		fireEvent.click(screen.getByText("Test Task"));

		// Content should now be visible
		expect(screen.getByText("Test Description")).toBeInTheDocument();
		expect(screen.getByText("Folder: Test Folder")).toBeInTheDocument();
		expect(screen.getByText(/Deadline:/)).toBeInTheDocument();
	});

	it("calls archiveTask when Archive button is clicked", () => {
		renderWithProvider(mockProps);

		// Expand the content
		fireEvent.click(screen.getByText("Test Task"));

		// Click archive button
		fireEvent.click(screen.getByText("Archive Task"));

		expect(archiveTask).toHaveBeenCalledWith(
			mockTask,
			"123",
			mockProps.onRefresh,
			expect.any(Function)
		);
	});

	it("calls recoverTask when Recover button is clicked", () => {
		renderWithProvider(mockProps);

		// Expand the content
		fireEvent.click(screen.getByText("Test Task"));

		// Click recover button
		fireEvent.click(screen.getByText("Recover Task"));

		expect(recoverTask).toHaveBeenCalledWith(
			mockTask,
			"123",
			mockProps.onRefresh,
			expect.any(Function)
		);
	});

	it("renders without due date when dueDate is null", () => {
		const taskWithoutDueDate = {
			...mockTask,
			dueDate: null,
		};

		renderWithProvider({ ...mockProps, task: taskWithoutDueDate });

		// Expand the content
		fireEvent.click(screen.getByText("Test Task"));

		// Deadline should not be present
		expect(screen.queryByText(/Deadline:/)).not.toBeInTheDocument();
	});
});
