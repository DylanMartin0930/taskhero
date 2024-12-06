"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Dashboard() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getUserData = async () => {
			try {
				const response = await axios.get("/api/users/me");
				const encryptedUserId = response.data.data.encryptedUserId;
				router.push(`/dashboard/profile/id?=${encryptedUserId}`);
			} catch (error: any) {
				toast.error("Failed to fetch user data");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		getUserData();
	}, [router]);

	if (loading) {
		return (
			<div className="w-full h-screen bg-[#FDF5E8] flex justify-center items-center">
				<p className="text-5xl font-bold">Loading, please wait...</p>
			</div>
		);
	}

	return null;
}
