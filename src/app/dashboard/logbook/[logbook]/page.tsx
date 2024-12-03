"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import LogBookWrapper from "@/components/ui/logbookwrapper";
import { fetchCompletedTasks } from "@/components/queries/fetchCompletedTasks";
import Grid from "@mui/material/Grid2";
import GraphWrapper from "@/components/ui/graphsWrapper";
import PieChart from "@/components/ui/piechart";

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
    <div className="bg-[#FDF5E8] text-black h-screen flex flex-col p-[10px] overflow-auto">
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

            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
              <div className="border border-black flex flex-grow items-center w-full">
                <PieChart token={token} />
              </div>
            </Grid>
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
