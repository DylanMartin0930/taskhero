"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import LogBookWrapper from "@/components/ui/logbookwrapper";
import { fetchCompletedTasks } from "@/components/queries/fetchCompletedTasks";

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
    <div className="bg-green-100 text-black">
      {isLoading ? (
        <p>Loading, please wait...</p> // Display while loading
      ) : (
        <>
          <div>
            <h1>{projectInfo.title}</h1>
            <h1>Created on: {projectInfo.createdDate}</h1>
            <h1>TaskList Size: {projectInfo.tasks.length}</h1>
          </div>
          <div>
            <LogBookWrapper
              projectId={token}
              fetchcall={fetchCompletedTasks}
              writeperm={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
