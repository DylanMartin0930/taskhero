"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
	const [token, setToken] = useState("");
	const [verified, setVerified] = useState(false);
	const [error, setError] = useState(false);

	const verifyUserEmail = async () => {
		try {
			await axios.post("/api/users/verifyemail", { token });
			setVerified(true);
		} catch (error: any) {
			setError(true);
			console.log(error.response.data);
		}
	};

	useEffect(() => {
		const urlToken = window.location.search.split("=")[1];
		setToken(urlToken || "");
	}, []);

	useEffect(() => {
		if (token.length > 0) {
			verifyUserEmail();
		}
	}, [token]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-[#fdf5e8] text-black">
			{!verified && !error && (
				<div className="bg-[#d9d9d9] border-2 border-black p-8 shadow-md">
					<h2 className="text-4xl font-bold text-center">LOADING</h2>
				</div>
			)}

			{verified && (
				<div className="bg-[#d9d9d9] border-2 border-black p-8 shadow-md">
					<h2 className="text-4xl font-bold text-center mb-4">
						Email Verified!
					</h2>
					<div className="text-center">
						<Link
							href="/login"
							className="text-blue-600 hover:text-blue-800 hover:underline"
						>
							Proceed to Login
						</Link>
					</div>
				</div>
			)}

			{error && (
				<div className="bg-[#d9d9d9] border-2 border-black p-8 shadow-md">
					<h2 className="text-4xl font-bold text-center text-black">
						Verification Expired
					</h2>
					<div className="text-center">
						<Link
							href="/signup"
							className="text-blue-600 hover:text-blue-800 hover:underline"
						>
							Please Sign Up Again
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
