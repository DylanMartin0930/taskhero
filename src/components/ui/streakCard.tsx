"use client";
import React from "react";

interface UserData {
	currentStreak?: number;
	longestStreak?: number;
	completedTasks?: number;
}

export default function StreakCard({ userData = {} as UserData }) {
	const { currentStreak = 0, longestStreak = 0, completedTasks = 0 } = userData;

	const Divider = () => <div className="border-l-2 border-gray-500 h-6 mx-4" />;

	const StatItem = ({ label, value }) => (
		<div className="flex items-center justify-center flex-1">
			<span className="font-semibold whitespace-nowrap">
				{label}: {value}
			</span>
		</div>
	);

	return (
		<div className="inline-flex items-center bg-[#b3b3b3] text-black border-2 border-black m-2 p-4 rounded-sm">
			<StatItem label="Current Streak" value={currentStreak} />
			<Divider />
			<StatItem label="Longest Streak" value={longestStreak} />
			<Divider />
			<StatItem label="Total Tasks Completed" value={completedTasks} />
		</div>
	);
}
