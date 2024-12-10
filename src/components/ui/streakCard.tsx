"use client";
import React from "react";

interface UserData {
	currentStreak?: number;
	longestStreak?: number;
	completedTasks?: number;
}

export default function StreakCard({ userData = {} as UserData }) {
	const { currentStreak = 0, longestStreak = 0, completedTasks = 0 } = userData;

	const Divider = () => (
		<div className="border-b-2 md:hidden w-1/2 h-[2px] my-2 mx-auto" />
	);

	const VerticalDivider = () => (
		<div className="hidden md:block w-[2px] h-full bg-black" />
	);

	const StatItem = ({ label, value }) => (
		<div className="flex items-center justify-center w-full p-2">
			<span className="font-semibold text-center">
				{label}: {value}
			</span>
		</div>
	);

	return (
		<div className="inline-flex flex-col items-center bg-[#b3b3b3] text-black border-2 mt-2 border-black p-4 rounded-sm w-full">
			<div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr,auto,1fr] gap-2 w-full">
				<StatItem label="Current Streak" value={currentStreak} />
				<VerticalDivider />
				<StatItem label="Longest Streak" value={longestStreak} />
				<VerticalDivider />
				<StatItem label="Total Tasks Completed" value={completedTasks} />
			</div>
		</div>
	);
}
