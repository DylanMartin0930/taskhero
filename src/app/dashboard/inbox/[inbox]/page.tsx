"use client";
import { fetchTasks } from "@/components/queries/fetchTasks";
import DueSoon from "@/components/ui/duesoon";
import TaskListWrapper from "@/components/ui/tasklistwrapper";
import GraphWrapper from "@/components/ui/graphsWrapper";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Grid from "@mui/material/Grid2";

export default function InboxPage({ params }: any) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectInfo, setProjectInfo] = useState({
    title: "",
    description: "",
    tasks: [],
  });

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
    <div className="bg-[#FDF5E8] text-black h-screen flex flex-col p-[10px]">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-5xl font-bold">Loading, please wait...</p>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-4xl font-bold italic capitalize">
              {projectInfo.title}
            </h1>
            <h1 className="text-base">Created on: {projectInfo.createdDate}</h1>
            <h1 className="text-base">
              TaskList Size: {projectInfo.tasks.length}
            </h1>
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
              </div>
            </Grid>
          </Grid>

          {/* TaskList Wrapper */}
          <div className="w-full mt-[10px]">
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
