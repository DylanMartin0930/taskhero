import { render, screen } from "@testing-library/react";
import React from "react";
import StreakCard from "../../src/components/ui/streakCard";

describe("StreakCard", () => {
	it("renders with default values when no userData is provided", () => {
		render(<StreakCard />);

		expect(screen.getByText("Current Streak: 0")).toBeInTheDocument();
		expect(screen.getByText("Longest Streak: 0")).toBeInTheDocument();
		expect(screen.getByText("Total Tasks Completed: 0")).toBeInTheDocument();
	});

	it("renders with provided userData values", () => {
		const mockUserData = {
			currentStreak: 5,
			longestStreak: 10,
			completedTasks: 25,
		};

		render(<StreakCard userData={mockUserData} />);

		expect(screen.getByText("Current Streak: 5")).toBeInTheDocument();
		expect(screen.getByText("Longest Streak: 10")).toBeInTheDocument();
		expect(screen.getByText("Total Tasks Completed: 25")).toBeInTheDocument();
	});

	it("renders dividers between stat items", () => {
		render(<StreakCard />);

		const dividers = screen
			.getAllByRole("generic")
			.filter((element) => element.className.includes("bg-black"));
		expect(dividers).toHaveLength(2);
	});
});
