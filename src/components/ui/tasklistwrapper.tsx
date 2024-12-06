"use client";
import NewTask from "@/components/ui/newtask-dropdown";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import CompleteTaskElement from "./complete-task-element";
import TaskElement from "./taskelement";

// Fetch tasks from the API using React Query and Axios
export default function TaskListWrapper({ projectId, fetchcall, writeperm }) {
	const {
		data: tasks,
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryFn: () => fetchcall(projectId),
		queryKey: ["tasks", projectId],
		staleTime: 60 * 10 * 1000, // 10 minutes
		cacheTime: 60 * 30 * 1000, // 30 minutes
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
		enabled: !!projectId,
		onError: (error) => {
			toast.error("Failed to fetch tasks.");
			console.error("Fetch error:", error);
		},
	});

	// Show loading state while fetching
	if (isLoading) {
		return (
			<div className="w-full text-center">
				<p>Loading tasks...</p>
			</div>
		);
	}

	// Show error message if there was an issue fetching tasks
	if (isError) {
		return (
			<div className="w-full text-center">
				<p>Error: {(error as Error).message}</p>
			</div>
		);
	}

	return (
		<div className="mb-4 w-full overflow-auto">
			{tasks?.length > 0 ? (
				tasks.map((task) =>
					writeperm ? (
						<TaskElement key={task._id} task={task} onRefresh={refetch} />
					) : (
						<CompleteTaskElement
							key={task._id}
							task={task}
							currentProjectId={projectId}
							onRefresh={refetch}
						/>
					)
				)
			) : (
				<p>No tasks available.</p>
			)}
			<div className="w-full">
				{writeperm && (
					<NewTask onTaskCreated={refetch} defaultProject={projectId} />
				)}
			</div>
		</div>
	);
}
