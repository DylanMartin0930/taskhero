"use client";
import headerImage from "@/assets/forrest-header.jpg";
import { useUser } from "@/components/context/UserContext";
import StreakCard from "@/components/ui/streakCard";
import UserInfoCard from "@/components/ui/UserInfoCard";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UserProfile() {
	const router = useRouter();
	const [token, setToken] = useState("");

	const { userData, isLoading, isError, refetch } = useUser();

	// Extract token from URL on initial load
	useEffect(() => {
		const urlToken = window.location.search.split("=")[1];
		if (urlToken) {
			setToken(urlToken);
		} else {
			toast.error("Token is missing in the URL");
			router.push("/login");
		}
	}, [router]);

	if (!token) {
		return <div>Loading...</div>;
	}

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return (
			<div>Error: {(error as any).message || "Failed to fetch user data."}</div>
		);
	}

	// Format user data for UserInfoCard
	const userInfoData = {
		username: userData.username,
		email: userData.email,
		verifiedOn: userData.verifiedOn,
		isVerified: userData.isVerified,
	};

	return (
		<div className="flex flex-col min-h-screen bg-[#fdf5e8]">
			{/* Profile Header */}
			<header
				className="flex items-center justify-center h-[25vh] bg-cover bg-center"
				style={{ backgroundImage: `url(${headerImage.src})` }}
			>
				<div className="flex flex-col items-center">
					{/* Profile Icon */}
					<div className="w-32 h-32 rounded-full bg-purple-300 border-4 border-white shadow-md" />
					{/* Username */}
					<h1 className="mt-4 text-white text-4xl font-bold">
						{userData.username}
					</h1>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-grow p-4 space-y-4">
				<UserInfoCard userInfo={userInfoData} refetch={refetch} />
				<StreakCard userData={userData} />
			</main>
		</div>
	);
}
