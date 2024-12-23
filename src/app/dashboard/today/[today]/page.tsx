"use client";
import { useGraphContext } from "@/components/context/GraphContext";
import { fetchToday } from "@/components/queries/fetchToday";
import { getProjectInfo } from "@/components/queries/getProjectInfo";
import DueSoon from "@/components/ui/duesoon";
import PieChart from "@/components/ui/piechart";
import TaskListWrapper from "@/components/ui/tasklistwrapper";
import Grid from "@mui/material/Grid2";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TodayPage({ params }: any) {
	const [token, setToken] = useState("");
	const { refreshPieData } = useGraphContext();

	// Handle URL token extraction
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const urlToken = urlParams.get("token");
		if (urlToken) {
			console.log("URL Token: ", urlToken);
			setToken(urlToken);
			refreshPieData(urlToken, "assigned");
		}
	}, []);

	// Fetch project info using React Query only when token is set
	const {
		data: projectInfo,
		isLoading,
		isFetching,
	} = useQuery({
		queryFn: () => getProjectInfo(token),
		queryKey: ["projectInfo", token],
		staleTime: 30000,
		cacheTime: 60000,
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
					{/* Title and HR */}
					<div>
						<h1 className="text-4xl font-bold italic capitalize">
							{projectInfo ? projectInfo.title : "Loading..."}
						</h1>
						<hr className="border-t-2 border-black my-4" />
					</div>

					{/* Graph and DueSoon container */}
					<Grid container spacing={2}>
						{/* Pie Chart*/}
						<Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
							<div className="border border-black flex flex-grow items-center w-full">
								<PieChart
									token={token}
									filter={"assigned"}
									showToggle={false}
								/>
							</div>
						</Grid>

						{/* DueSoon */}
						<Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
							<div className="flex flex-col w-full">
								<h1 className="bg-[#d9d9d9] text-lg border border-black font-bold text-left w-fit pl-1 pr-1">
									DUE SOON!
								</h1>
								<DueSoon token={token} />
							</div>
						</Grid>
					</Grid>

					{/* TaskList Wrapper */}
					<div className="w-full mt-[10px]">
						<TaskListWrapper
							projectId={token}
							fetchcall={fetchToday}
							writeperm={true}
						/>
					</div>
				</>
			)}
		</div>
	);
}
