"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { fetchProjects } from "../queries/fetchProjects";
import DefaultOptions from "./defaultoptions";
import Dropdown from "./dropdown";
import NewFolderProjectsButton from "./newFolderProjects-button";
import ProjectList from "./projectList";
import { IoIosMenu } from "react-icons/io";

export default function Navbar({
  setOnRefresh,
}: {
  setOnRefresh: (fn: () => void) => void;
}) {
  const [userData, setData] = React.useState("");
  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data.username);
  };

  const [projects, setProjects] = useState([]);
  const [defaults, setDefaults] = useState([]);

  const [isNavbarVisible, setIsNavbarVisible] = useState(true); // State to track navbar visibility

  const onRefresh = async () => {
    console.log("Refreshing");
    fetchProjects(setProjects, null, false);
    fetchProjects(setDefaults, null, true);
  };

  useEffect(() => {
    fetchProjects(setProjects, null, false);
    fetchProjects(setDefaults, null, true);
    setOnRefresh(onRefresh);
    getUserDetails();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <div
        className={`relative flex flex-col space-y-[10px] p-2 left-0 h-screen bg-[#777777] transition-all duration-300 ease-in-out ${isNavbarVisible ? "w-[250px]" : "w-[40px] p-0 m-0"}`}
      >
        {/* Logo and Toggle Button */}
        <div
          className={`flex justify-between items-center p-2 bg-[#D9D9D9] border border-black ${isNavbarVisible ? "shadow-black shadow-md" : ""}`}
        >
          <h1
            className={`text-black text-2xl font-bold ${isNavbarVisible ? "" : "hidden"}`}
          >
            TaskHero
          </h1>

          {/* Toggle Button */}
          <IoIosMenu
            color="white"
            size={25}
            className="text-black bg-[#777777] rounded text-3xl"
            onClick={() => setIsNavbarVisible((prev) => !prev)}
          ></IoIosMenu>
        </div>

        {/* User */}
        <div
          className={`${isNavbarVisible ? "shadow-md shadow-black " : "hidden"}`}
        >
          <Dropdown userInfo={userData} />
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
