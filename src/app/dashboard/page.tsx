"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

// Function to fetch user data
const fetchUserData = async () => {
	const response = await axios.get("/api/users/me");
	return response.data.data;
};

export default function Dashboard() {
	const router = useRouter();

	// Use React Query to fetch user data
	const { data, isLoading, isError } = useQuery({
		queryKey: ["userData"],
		queryFn: fetchUserData,
		retry: 1,
		onError: (error) => {
			toast.error("Failed to fetch user data");
			console.error(error);
		},
	});

	// Handle redirect when data is available
	useEffect(() => {
		if (data?.encryptedUserId) {
			router.push(`/dashboard/profile/id?=${data.encryptedUserId}`);
		}
	}, [data, router]);

	if (isLoading) {
		return (
			<div className="w-full h-screen bg-[#FDF5E8] flex justify-center items-center">
				<p className="text-5xl font-bold">Loading, please wait...</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="w-full h-screen bg-[#FDF5E8] flex justify-center items-center">
				<p className="text-5xl font-bold text-red-500">
					Error loading user data
				</p>
			</div>
		);
	}

	return null;
}
