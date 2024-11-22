"use client";
import React from "react";
import { useTaskContext } from "../context/DueSoonContext";
import PlainTaskList from "./plaintasklist";

export default function DueSoon() {
	const { tasks, refreshTasks, isLoading } = useTaskContext();

	return (
		<div
			className={`bg-green-100 text-black h-full flex flex-col ${
				!isLoading ? "m-[5px]" : ""
			}`}
		>
			{isLoading ? (
				<p>Loading, please wait...</p> // Display while loading
			) : (
				<>
					{/* h1 Container */}
					<div className="p-2 border-2 border-black w-fit">
						<h1 className="text-sm font-bold">DUE SOON!</h1>
					</div>

					{/* PlainTaskList Container */}
					<div className="flex-grow">
						<PlainTaskList tasks={tasks} />
					</div>
				</>
			)}
		</div>
	);
}
