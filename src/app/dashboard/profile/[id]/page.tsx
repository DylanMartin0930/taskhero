"use client";
import headerImage from "@/assets/forrest-header.jpg"; // Import the image
import { useUser } from "@/components/context/UserContext";
import StreakCard from "@/components/ui/streakCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Fetch user details using token

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

  // Use React Query to fetch user data

  if (!token) {
    return <div>Loading...</div>; // Wait until token is set
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div>Error: {(error as any).message || "Failed to fetch user data."}</div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fdf5e8]">
      {/* Profile Header */}
      <header
        className="flex items-center justify-center h-[25vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${headerImage.src})` }} // Use the imported image as background
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

      {/* Additional Content Placeholder */}
      <main className="flex-grow p-4">
        <StreakCard userData={userData} />
      </main>
    </div>
  );
}
