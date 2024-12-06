import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LineGraph from "../../src/components/ui/linegraph";

// Mock Chart.js to avoid rendering issues in tests
vi.mock("react-chartjs-2", () => ({
	Line: ({ data, options }) => (
		<div data-testid="line-chart">
			{/* Render graph title */}
			<span>{options.plugins.title.text}</span>
			{/* Render labels in a way that's visible to the DOM */}
			{data.labels.map((label) => (
				<span key={label}>{label}</span>
			))}
			<div data-testid="chart-data">{JSON.stringify(data)}</div>
			<div data-testid="chart-options">{JSON.stringify(options)}</div>
		</div>
	),
}));

const mockData = {
	weeklyData: {
		labels: ["Mon", "Tue", "Wed"],
		datasets: [
			{
				label: "Project 1",
				data: [1, 2, 3],
				borderColor: "#000",
			},
		],
		graphTitle: "Weekly Tasks",
	},
	monthlyData: {
		labels: ["Jan", "Feb", "Mar"],
		datasets: [
			{
				label: "Project 1",
				data: [4, 5, 6],
				borderColor: "#000",
			},
		],
		graphTitle: "Monthly Tasks",
	},
};

describe("LineGraph", () => {
	it("renders the graph with weekly data by default", () => {
		render(
			<LineGraph
				weeklyData={mockData.weeklyData}
				monthlyData={mockData.monthlyData}
				haveData={true}
			/>
		);

		expect(screen.getByText("Weekly")).toBeInTheDocument();
		expect(screen.getByText("Monthly")).toBeInTheDocument();
		mockData.weeklyData.labels.forEach((label) => {
			expect(screen.getByText(label)).toBeInTheDocument();
		});
	});

	it("switches between weekly and monthly views and shows correct labels", () => {
		render(
			<LineGraph
				weeklyData={mockData.weeklyData}
				monthlyData={mockData.monthlyData}
				haveData={true}
			/>
		);

		// Check weekly view first
		expect(screen.getByText("Weekly Tasks")).toBeInTheDocument();
		mockData.weeklyData.labels.forEach((label) => {
			expect(screen.getByText(label)).toBeInTheDocument();
		});

		// Switch to monthly view and check labels
		fireEvent.click(screen.getByText("Monthly"));
		expect(screen.getByText("Monthly Tasks")).toBeInTheDocument();
		mockData.monthlyData.labels.forEach((label) => {
			expect(screen.getByText(label)).toBeInTheDocument();
		});

		// Switch back to weekly
		fireEvent.click(screen.getByText("Weekly"));
		expect(screen.getByText("Weekly Tasks")).toBeInTheDocument();
	});

	it("shows loading state when haveData is false", () => {
		render(
			<LineGraph
				weeklyData={mockData.weeklyData}
				monthlyData={mockData.monthlyData}
				haveData={false}
			/>
		);

		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});
});
