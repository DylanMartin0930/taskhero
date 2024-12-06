"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { fetchProjects } from "../queries/fetchProjects";
import DefaultOptions from "./defaultoptions";
import Dropdown from "./dropdown";
import NewFolderProjectsButton from "./newFolderProjects-button";
import ProjectList from "./projectList";

export default function Navbar({
  setOnRefresh,
}: {
  setOnRefresh: (fn: () => void) => void;
}) {
  const [userData, setUserData] = useState<any>(null); // Store user data
  const [projects, setProjects] = useState([]);
  const [defaults, setDefaults] = useState([]);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true); // State to track navbar visibility

  // Fetch user data
  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/me");
      setUserData(res.data.data); // Set user data
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch projects and defaults
  const onRefresh = async () => {
    console.log("Refreshing");
    fetchProjects(setProjects, null, false);
    fetchProjects(setDefaults, null, true);
  };

  useEffect(() => {
    fetchProjects(setProjects, null, false);
    fetchProjects(setDefaults, null, true);
    setOnRefresh(onRefresh);
    getUserDetails(); // Fetch user data when component mounts
  }, [setOnRefresh]); // Only re-run when `setOnRefresh` changes

  return (
    <div>
      {/* Navbar */}
      <div
        className={`relative flex flex-col space-y-[10px] p-2 left-0 h-screen bg-[#777777] transition-all duration-300 ease-in-out ${
          isNavbarVisible ? "w-[250px]" : "w-[40px] p-0 m-0"
        }`}
      >
        {/* Logo and Toggle Button */}
        <div
          className={`flex justify-between items-center p-2 bg-[#D9D9D9] border border-black ${
            isNavbarVisible ? "shadow-black shadow-md" : "p-0 "
          }`}
        >
          <h1
            className={`text-black text-2xl font-bold ${
              isNavbarVisible ? "" : "hidden"
            }`}
          >
            TaskHero
          </h1>

          {/* Toggle Button */}
          <IoIosMenu
            data-testid="nav-button"
            color="white"
            size={25}
            className={`text-black bg-[#777777] rounded text-3xl cursor-pointer ${
              isNavbarVisible ? "w-8 h-8" : "fixed w-10 left-0"
            }`}
            onClick={() => setIsNavbarVisible((prev) => !prev)}
          />
        </div>

        {/* User Section */}
        <div
          className={`${
            isNavbarVisible ? "shadow-md shadow-black " : "hidden"
          }`}
        >
          {/* Pass the userData to Dropdown */}
          {userData && (
            <Dropdown
              userName={userData.user.username}
              userId={userData.encryptedUserId}
            />
          )}
        </div>

        {/* Default Routes */}
        <div
          className={`${isNavbarVisible ? "shadow-md shadow-black" : "hidden"}`}
        >
          <DefaultOptions defaultOptions={defaults} />
        </div>

        {/* Project List */}
        <div
          className={`${isNavbarVisible ? "shadow-md shadow-black" : "hidden"}`}
        >
          <ProjectList projects={projects} onRefresh={onRefresh} />
        </div>

        {/* New Folder/Projects Button */}
        <div
          className={`${isNavbarVisible ? "shadow-md shadow-black" : "hidden"}`}
        >
          <NewFolderProjectsButton onRefresh={onRefresh} />
        </div>
      </div>
    </div>
  );
}
