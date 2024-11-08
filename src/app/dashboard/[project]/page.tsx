"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { deleteProject } from "@/components/queries/deleteProject";
import { useRouter } from "next/navigation";

export default function ProjectPage({ params }: any) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const projectId = params.project;
  const [projectInfo, setProjectInfo] = useState({
    title: "",
    description: "",
    tasks: [],
  });

  const getProjectInfo = async () => {
    try {
      setIsLoading(true); // Set loading to true before starting the request
      const response = await axios.post("/api/projects/projectInfo", {
        projectId,
      });
      toast.success(response.data.message);
      setProjectInfo(response.data.data);
    } catch (error) {
      toast.error("Something went wrong");
      toast.error(error.message);
    } finally {
      setIsLoading(false); // Set loading to false after the request completes (either success or error)
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully");
      getProjectInfo(); // Refresh the project info after deletion
      router.push("/dashboard/inbox");
    } catch (error) {
      toast.error("Something went wrong");
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProjectInfo();
  }, []);

  return (
    <div className="bg-green-100 text-black">
      {isLoading ? (
        <p>Loading, please wait...</p> // Display while loading
      ) : (
        <>
          <h1>{projectInfo.title}</h1>
          <h1>Created on: {projectInfo.createdDate}</h1>
          <h1>TaskList Size: {projectInfo.tasks.length}</h1>
        </>
      )}

      <button
        className="mt-2 bg-red-500 text-whiterounded-md rounded border border-black w-48"
        onClick={handleDeleteProject}
      >
        Delete Project
      </button>
    </div>
  );
}
