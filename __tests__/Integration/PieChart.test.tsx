import LineGraph from "@/components/ui/linegraph";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock the Chart.js components and exports
vi.mock("chart.js", () => ({
	Chart: {
		register: vi.fn(),
	},
	CategoryScale: class CategoryScale {},
	LinearScale: class LinearScale {},
	PointElement: class PointElement {},
	LineElement: class LineElement {},
	Title: class Title {},
	Tooltip: class Tooltip {},
	Legend: class Legend {},
}));

// Mock the react-chartjs-2 Line component
vi.mock("react-chartjs-2", () => ({
	Line: () => <div data-testid="mock-line-chart">Line Chart</div>,
}));

describe("LineGraph Component", () => {
	const mockWeeklyData = {
		labels: ["Mon", "Tue", "Wed"],
		datasets: [
			{
				label: "Project A",
				data: [1, 2, 3],
				borderColor: "#FF0000",
			},
		],
		graphTitle: "Weekly Tasks",
	};

	const mockMonthlyData = {
		labels: ["Week 1", "Week 2", "Week 3"],
		datasets: [
			{
				label: "Project A",
				data: [4, 5, 6],
				borderColor: "#00FF00",
			},
		],
		graphTitle: "Monthly Tasks",
	};

	it("renders without crashing", () => {
		render(
			<LineGraph
				weeklyData={mockWeeklyData}
				monthlyData={mockMonthlyData}
				haveData={true}
			/>
		);
		expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
	});

	it("shows weekly view by default", () => {
		render(
			<LineGraph
				weeklyData={mockWeeklyData}
				monthlyData={mockMonthlyData}
				haveData={true}
			/>
		);
		const weeklyButton = screen.getByText("Weekly");
		expect(weeklyButton).toHaveClass("bg-[#b3b3b3]");
	});

	it("toggles between weekly and monthly views", () => {
		render(
			<LineGraph
				weeklyData={mockWeeklyData}
				monthlyData={mockMonthlyData}
				haveData={true}
			/>
		);

		const monthlyButton = screen.getByText("Monthly");
		fireEvent.click(monthlyButton);

		expect(monthlyButton).toHaveClass("bg-[#b3b3b3]");
	});

	it("displays loading state when no data is available", () => {
		render(
			<LineGraph
				weeklyData={mockWeeklyData}
				monthlyData={mockMonthlyData}
				haveData={false}
			/>
		);
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});
});
