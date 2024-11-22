"use client";
import { useNavbarFunction } from "@/components/context/NavbarFunctionContext";
import { fetchTasks } from "@/components/queries/fetchTasks";
import TaskListWrapper from "@/components/ui/tasklistwrapper";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProjectPage({ params }: any) {
	const [token, setToken] = useState("");
	const { onRefresh } = useNavbarFunction();
	const [isLoading, setIsLoading] = useState(false);
	const [projectInfo, setProjectInfo] = useState({
		title: "",
		description: "",
		tasks: [],
	});
	const [isEditingTitle, setIsEditingTitle] = useState(false); // Track if title is being edited
	const [newTitle, setNewTitle] = useState(""); // Track the new title value

	const getProjectInfo = async () => {
		try {
			if (!token) return; // Ensure we don't proceed if token is empty
			console.log("Token: ", token);
			setIsLoading(true); // Set loading to true before starting the request
			const response = await axios.post("/api/projects/projectInfo", {
				token,
			});
			toast.success(response.data.message);
			setProjectInfo(response.data.data);
		} catch (error: any) {
			toast.error("Something went wrong");
			toast.error(error.message);
		} finally {
			setIsLoading(false); // Set loading to false after the request completes (either success or error)
		}
	};

	const updateProjectTitle = async () => {
		try {
			setIsLoading(true);
			const response = await axios.post("/api/projects/updateTitle", {
				projectId: token,
				newTitle,
			});
			toast.success(response.data.message);
			onRefresh(); // Refresh the project list
			setProjectInfo((prev) => ({ ...prev, title: newTitle }));
			setIsEditingTitle(false);
		} catch (error: any) {
			toast.error("Failed to update title");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const urlToken = window.location.search.split("=")[1];
		console.log("URL Token: ", urlToken);
		setToken(urlToken);
	}, []);

	useEffect(() => {
		if (token) {
			getProjectInfo();
		}
	}, [token]); // Run getProjectInfo when the token changes and is set

	return (
		<div className="bg-green-100 text-black">
			{isLoading ? (
				<p>Loading, please wait...</p> // Display while loading
			) : (
				<>
					<div>
						<h1>
							{isEditingTitle ? (
								<input
									type="text"
									value={newTitle}
									onChange={(e) => setNewTitle(e.target.value)}
									onBlur={updateProjectTitle} // Save on blur
									onKeyDown={(e) => {
										if (e.key === "Enter") updateProjectTitle(); // Save on Enter
									}}
									autoFocus
									className="border border-gray-300 p-1"
								/>
							) : (
								<span
									onDoubleClick={() => {
										setIsEditingTitle(true);
										setNewTitle(projectInfo.title); // Set initial value
									}}
									className="cursor-pointer"
								>
									{projectInfo.title}
								</span>
							)}
						</h1>
						<h1>Created on: {projectInfo.createdDate}</h1>
						<h1>TaskList Size: {projectInfo.tasks.length}</h1>
					</div>
					<div>
						<TaskListWrapper
							projectId={token}
							fetchcall={fetchTasks}
							writeperm={true}
						/>
					</div>
				</>
			)}
		</div>
	);
}
