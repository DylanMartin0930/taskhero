"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import TaskListWrapper from "@/components/ui/tasklistwrapper";
import { fetchToday } from "@/components/queries/fetchToday";
import { getProjectInfo } from "@/components/queries/getProjectInfo";
import PieChart from "@/components/ui/piechart";
import DueSoon from "@/components/ui/duesoon";
import Grid from "@mui/material/Grid2";

export default function TodayPage({ params }: any) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectInfo, setProjectInfo] = useState({
    title: "",
    description: "",
    tasks: [],
  });

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    console.log("URL Token: ", urlToken);
    setToken(urlToken);
  }, []);

  useEffect(() => {
    if (token) {
      getProjectInfo(token, setProjectInfo, setIsLoading);
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
          {/* Title and HR */}
          <div>
            <h1 className="text-4xl font-bold italic capitalize">
              {projectInfo.title}
            </h1>
            <hr className="border-t-2 border-black my-4" /> {/* Black hr */}
          </div>

          {/* Graph and DueSoon container */}
          <Grid container spacing={2}>
            {/* Pie Chart*/}
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
              <div className="border border-black flex flex-grow items-center w-full">
                <PieChart token={token} />
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
              fetchcall={fetchToday}
              writeperm={true}
            />
          </div>
        </>
      )}
    </div>
  );
}
