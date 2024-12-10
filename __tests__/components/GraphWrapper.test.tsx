import { useGraphContext } from "@/components/context/GraphContext";
import GraphWrapper from "@/components/ui/graphsWrapper";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

// Mock the GraphContext
vi.mock("@/components/context/GraphContext", () => ({
	useGraphContext: vi.fn(),
}));

// Mock the LineGraph component
vi.mock("@/components/ui/linegraph", () => ({
	default: () => <div data-testid="line-graph">Line Graph</div>,
}));

describe("GraphWrapper", () => {
	const mockRefreshRegularData = vi.fn();
	const defaultProps = {
		token: "test-token",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("calls refreshRegularData when token is available and data is not loaded", () => {
		vi.mocked(useGraphContext).mockReturnValue({
			weeklyData: [],
			monthlyData: [],
			haveWeeklyData: false,
			haveMonthlyData: false,
			refreshRegularData: mockRefreshRegularData,
		});

		render(<GraphWrapper {...defaultProps} />);

		expect(mockRefreshRegularData).toHaveBeenCalledWith("test-token");
	});

	it("does not call refreshRegularData when data is already loaded", () => {
		vi.mocked(useGraphContext).mockReturnValue({
			weeklyData: [{ date: "2024-03-20", count: 5 }],
			monthlyData: [{ date: "2024-03", count: 15 }],
			haveWeeklyData: true,
			haveMonthlyData: true,
			refreshRegularData: mockRefreshRegularData,
			isLoadingWeekly: false,
			isLoadingMonthly: false,
		});

		render(<GraphWrapper {...defaultProps} />);

		expect(mockRefreshRegularData).not.toHaveBeenCalled();
	});

	it("shows loading state when data is not fully loaded", () => {
		vi.mocked(useGraphContext).mockReturnValue({
			weeklyData: [],
			monthlyData: [],
			haveWeeklyData: true,
			haveMonthlyData: false,
			refreshRegularData: mockRefreshRegularData,
		});

		render(<GraphWrapper {...defaultProps} />);

		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("renders LineGraph when all data is available", () => {
		const mockData = {
			weeklyData: [{ date: "2024-03-20", count: 5 }],
			monthlyData: [{ date: "2024-03", count: 15 }],
			haveWeeklyData: true,
			haveMonthlyData: true,
			refreshRegularData: mockRefreshRegularData,
		};

		vi.mocked(useGraphContext).mockReturnValue(mockData);

		render(<GraphWrapper {...defaultProps} />);

		expect(screen.getByTestId("line-graph")).toBeInTheDocument();
	});

	it("applies correct styling based on data availability", async () => {
		vi.mocked(useGraphContext).mockReturnValue({
			weeklyData: [{ date: "2024-03-20", count: 5 }],
			monthlyData: [{ date: "2024-03", count: 15 }],
			haveWeeklyData: true,
			haveMonthlyData: true,
			refreshRegularData: mockRefreshRegularData,
		});

		const { container } = render(<GraphWrapper {...defaultProps} />);

		const wrapper = container.firstChild;
		expect(wrapper).toHaveClass(
			"w-full",
			"h-full",
			"min-h-[200px]",
			"max-h-[400px]",
			"overflow-hidden",
			"transition-all",
			"duration-500",
			"ease-out"
		);
	});
});
