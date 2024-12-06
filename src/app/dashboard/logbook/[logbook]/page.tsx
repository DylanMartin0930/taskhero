"use client";
import { useGraphContext } from "@/components/context/GraphContext";
import { fetchCompletedTasks } from "@/components/queries/fetchCompletedTasks";
import { getProjectInfo } from "@/components/queries/getProjectInfo";
import GraphWrapper from "@/components/ui/graphsWrapper";
import LogBookWrapper from "@/components/ui/logbookwrapper";
import PieChart from "@/components/ui/piechart";
import Grid from "@mui/material/Grid2";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function InboxPage({ params }: any) {
	const [token, setToken] = useState("");
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const urlToken = urlParams.get("token");
		console.log("URL Token: ", urlToken);
		setToken(urlToken || ""); // Set an empty string if token is missing
	}, [token]);

	const {
		data: projectInfo,
		isLoading,
		isFetching,
	} = useQuery({
		queryFn: () => getProjectInfo(token),
		queryKey: ["projectInfo", token],
		staleTime: 30000,
		cacheTime: 60000,
		refetchOnWindowFocus: true, // Automatically refetch stale data on focus
		refetchOnReconnect: true, // Refetch when network reconnects
		enabled: !!token, // Run query only when token is available
		onError: (error) => {
			toast.error("Failed to fetch project information.");
			console.error(error);
		},
	});

	useEffect(() => {
		console.log("INBOX IS isFetching: ", isFetching); // Log if data is fetching
	}, [isFetching]);

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
							{projectInfo ? projectInfo.title : "Loading..."}
						</h1>
						<hr className="border-t-2 border-black my-4" /> {/* Black hr */}
					</div>

					{/* Graph and DueSoon Wrapper */}
					<Grid container spacing={2}>
						{/* GraphWrapper */}
						{token && (
							<Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
								<div className="border border-black flex flex-grow items-center w-full">
									<GraphWrapper token={token} />
								</div>
							</Grid>
						)}

						{/* PieChart */}
						{token && (
							<Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
								<div className="border border-black flex flex-grow items-center w-full">
									<PieChart
										token={token}
										filter="completed"
										showToggle={true}
									/>
								</div>
							</Grid>
						)}
					</Grid>

					{/* TaskList Wrapper */}
					<div className="w-full mt-[10px]">
						<LogBookWrapper
							projectId={token}
							fetchcall={fetchCompletedTasks}
							writeperm={true}
						/>
					</div>
				</>
			)}
		</div>
	);
}
