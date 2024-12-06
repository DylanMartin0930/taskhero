"use client";
import { fetchTasks } from "@/components/queries/fetchTasks";
import { getProjectInfo } from "@/components/queries/getProjectInfo";
import TaskListWrapper from "@/components/ui/tasklistwrapper";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TrashPage({ params }: any) {
	const [token, setToken] = useState("");

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const urlToken = urlParams.get("token");
		setToken(urlToken || "");
	}, [token]);

	const { data: projectInfo, isLoading } = useQuery({
		queryFn: () => getProjectInfo(token),
		queryKey: ["projectInfo", token],
		staleTime: 30000,
		gcTime: 60000,
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
		enabled: !!token,
		onError: (error) => {
			toast.error("Failed to fetch project information.");
			console.error(error);
		},
	});

	return (
		<div className="bg-[#FDF5E8] text-black h-screen flex flex-col p-[10px] overflow-auto">
			{isLoading ? (
				<div className="flex justify-center items-center h-full">
					<p className="text-5xl font-bold">Loading, please wait...</p>
				</div>
			) : (
				<>
					<div>
						<h1 className="text-4xl font-bold italic capitalize">
							{projectInfo ? `${projectInfo.title}` : "Loading..."}
						</h1>
						<hr className="border-t-2 border-black my-4" />
					</div>

					{/* TaskList Wrapper */}
					<div className="w-full mt-[10px]">
						<TaskListWrapper
							projectId={token}
							fetchcall={fetchTasks}
							writeperm={false}
						/>
					</div>
				</>
			)}
		</div>
	);
}
