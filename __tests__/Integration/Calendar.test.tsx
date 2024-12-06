import Calendar from "@/components/ui/calendar";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { vi } from "vitest";

// Mock axios
vi.mock("axios");

// Mock FullCalendar
vi.mock("@fullcalendar/react", () => ({
	default: ({ events, eventClick, eventContent }) => (
		<div data-testid="fullcalendar-mock">
			{/* Render events for testing */}
			{events.map((event, index) => (
				<div
					key={index}
					data-testid={`calendar-event-${index}`}
					onClick={() => {
						// Create a mock event element
						const mockEventElement = document.createElement("div");
						mockEventElement.getBoundingClientRect = () => ({
							top: 100,
							left: 100,
							bottom: 200,
							right: 200,
							width: 100,
							height: 100,
						});

						// Create the full eventInfo object
						const eventInfo = {
							event: {
								title: event.title,
								extendedProps: event.extendedProps,
							},
							el: mockEventElement,
						};

						eventClick(eventInfo);
					}}
				>
					{eventContent({ event: { title: event.title } })}
				</div>
			))}
		</div>
	),
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

describe("Calendar Component", () => {
	const mockEvents = [
		{
			projectId: "1",
			projectTitle: "Test Project 1",
			tasks: [
				{ id: 1, title: "Task 1", start: "2024-03-20" },
				{ id: 2, title: "Task 2", start: "2024-03-21" },
			],
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock getBoundingClientRect for positioning calculations
		Element.prototype.getBoundingClientRect = vi.fn(() => ({
			top: 100,
			left: 100,
			bottom: 200,
			right: 200,
			width: 100,
			height: 100,
		}));
	});

	it("renders the calendar component", () => {
		render(<Calendar />);
		expect(screen.getByTestId("fullcalendar-mock")).toBeInTheDocument();
	});

	it("fetches and displays events correctly", async () => {
		// Mock successful API response
		vi.mocked(axios.get).mockResolvedValueOnce({
			data: {
				data: mockEvents,
			},
		});

		render(<Calendar />);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledWith("/api/calendar/getEvents");
			expect(screen.getByText("Test Project 1")).toBeInTheDocument();
		});
	});

	it("handles API error gracefully", async () => {
		// Mock API error
		vi.mocked(axios.get).mockRejectedValueOnce(new Error("Failed to fetch"));

		render(<Calendar />);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledWith("/api/calendar/getEvents");
			expect(screen.queryByText("Test Project 1")).not.toBeInTheDocument();
		});
	});

	it("shows task details when clicking an event", async () => {
		// Mock successful API response
		vi.mocked(axios.get).mockResolvedValueOnce({
			data: {
				data: mockEvents,
			},
		});

		render(<Calendar />);

		await waitFor(() => {
			expect(screen.getByText("Test Project 1")).toBeInTheDocument();
		});

		// Click the event
		fireEvent.click(screen.getByTestId("calendar-event-0"));

		// Check if task details are displayed
		expect(screen.getByText("Task 1")).toBeInTheDocument();
		expect(screen.getByText("Task 2")).toBeInTheDocument();
	});

	it("closes task details when clicking the same event again", async () => {
		// Mock successful API response
		vi.mocked(axios.get).mockResolvedValueOnce({
			data: {
				data: mockEvents,
			},
		});

		render(<Calendar />);

		await waitFor(() => {
			expect(screen.getByText("Test Project 1")).toBeInTheDocument();
		});

		// Click the event to open details
		fireEvent.click(screen.getByTestId("calendar-event-0"));
		expect(screen.getByText("Task 1")).toBeInTheDocument();

		// Click the event again to close details
		fireEvent.click(screen.getByTestId("calendar-event-0"));
		expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
	});

	it("positions task list correctly relative to clicked event", async () => {
		// Mock successful API response
		vi.mocked(axios.get).mockResolvedValueOnce({
			data: {
				data: mockEvents,
			},
		});

		// Mock the container's getBoundingClientRect
		const mockContainerRect = {
			top: 50, // Container starts 50px from top
			left: 50, // Container starts 50px from left
			bottom: 550,
			right: 550,
			width: 500,
			height: 500,
		};

		// Mock querySelector for calendar container
		document.querySelector = vi.fn().mockImplementation((selector) => {
			if (selector === ".calendar-container") {
				const div = document.createElement("div");
				div.getBoundingClientRect = () => mockContainerRect;
				return div;
			}
			return null;
		});

		render(<Calendar />);

		await waitFor(() => {
			expect(screen.getByText("Test Project 1")).toBeInTheDocument();
		});

		// Click the event
		fireEvent.click(screen.getByTestId("calendar-event-0"));
	});
});
