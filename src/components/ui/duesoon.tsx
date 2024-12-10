"use client";
import React from "react";
import { useTaskContext } from "../context/DueSoonContext";
import PlainTaskList from "./plaintasklist";

export default function DueSoon() {
	const { tasks, refreshTasks, isLoading } = useTaskContext();

	return (
		<div className="w-full h-full min-h-[200px] max-h-[400px] flex flex-col">
			{isLoading ? (
				<div className="w-full h-full flex items-center justify-center bg-[#d9d9d9] border border-black">
					<p>Loading, please wait...</p>
				</div>
			) : (
				<div className="w-full h-full">
					<PlainTaskList tasks={tasks} />
				</div>
			)}
		</div>
	);
}
