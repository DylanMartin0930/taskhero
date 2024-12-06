"use client";
import { fetchTasks } from "@/components/queries/fetchTasks";
import DueSoon from "@/components/ui/duesoon";
import TaskListWrapper from "@/components/ui/tasklistwrapper";
import GraphWrapper from "@/components/ui/graphsWrapper";
import { getProjectInfo } from "@/components/queries/getProjectInfo";
import StreakCard from "@/components/ui/streakCard"; // Import the StreakCard component
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/components/context/UserContext";
import toast from "react-hot-toast";
import axios from "axios";

// Function to fetch user data (assuming the token is used to fetch user info)
const fetchUserData = async ({ token }: { token: string }) => {
  const response = await axios.get("/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data.user; // Assuming the user data is in the `data` field
};

export default function InboxPage({ params }: any) {
  const [token, setToken] = useState("");

  // Handle URL token extraction
  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];

    if (urlToken && urlToken !== token) {
      setToken(urlToken || ""); // Update token only if it's different
    }
  }, [token]); // Make sure token change is only triggered once

  // Fetch project info using React Query only when token is set
  const {
    data: projectInfo,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryFn: () => getProjectInfo(token),
    queryKey: ["projectInfo", token],
    staleTime: 3000000, // 50 minutes (3000000 ms)
    cacheTime: 14400000, // 4 hours (14400000 ms)
    refetchOnWindowFocus: true, // Automatically refetch stale data on focus
    refetchOnReconnect: true, // Refetch when network reconnects
    enabled: !!token, // Run query only when token is available
    onError: (error) => {
      toast.error("Failed to fetch project information.");
      console.error(error);
    },
  });

  const {
    userData,
    isLoading: isUserLoading,
    isError: isUserError,
    refetch,
  } = useUser();

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    console.log("INBOX IS isFetching: ", isFetching); // Log if data is fetching
  }, [isFetching]);

  // Prevent rendering until the query has been initialized or has fetched
  if (isLoading || !token) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-5xl font-bold">Loading, please wait...</p>
      </div>
    );
  }

  if (isError || !projectInfo) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-5xl font-bold">
          Error: {(error as any).message || "Failed to load project info."}
        </p>
      </div>
    );
  }

  if (isUserError || !userData) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-5xl font-bold">Error: Failed to fetch user data.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF5E8] text-black h-screen flex flex-col p-[10px] overflow-auto">
      <>
        <div>
          <h1 className="text-4xl font-bold italic capitalize">
            {projectInfo.title}
          </h1>
          <h1 className="text-base">Created on: {projectInfo.createdDate}</h1>
          <h1 className="text-base">
            TaskList Size: {projectInfo.tasks.length}
          </h1>
          <h1 className="text-base">Assigned Color: {projectInfo.color}</h1>
          <hr className="border-t-2 border-black my-4" /> {/* Black hr */}
        </div>

        {/* Graph and DueSoon Wrapper */}
        <Grid container spacing={2}>
          {/* GraphWrapper */}
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
            <div className="border border-black flex flex-grow items-center w-full">
              <GraphWrapper token={token} />
            </div>
          </Grid>
          {/* DueSoon */}
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
            <div className="flex flex-col w-full">
              {/* Header Container */}
              <h1 className="bg-[#d9d9d9] text-lg border border-black font-bold text-left w-fit pl-1 pr-1">
                DUE SOON!
              </h1>
              <DueSoon token={token} />
              <StreakCard userData={userData} />{" "}
            </div>
          </Grid>
        </Grid>

        {/* Streak Card Below DueSoon */}

        {/* TaskList Wrapper */}
        <div className="w-full mt-[10px]">
          <TaskListWrapper
            projectId={token}
            fetchcall={fetchTasks}
            writeperm={true}
          />
        </div>
      </>
    </div>
  );
}
