"use client";
import Dropdown from "./dropdown";
import { DefaultOptions } from "./defaultoptions";
import React, { useEffect } from "react";
import axios from "axios";
import NewFolderProjectsButton from "./newFolderProjects-button";
import ProjectList from "./projectList";

export default function Navbar() {
  const [userData, setData] = React.useState("");
  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data.username);
  };

  useEffect(() => {
    getUserDetails();
  });
  return (
    <div className="fixed flex flex-col space-y-[10px] top-[60px] left-0 w-[300px] p-[10px] h-screen bg-gray-800">
      {/* Logo */}
      <div>
        <h1>TaskHero</h1>
      </div>

      {/* User */}
      <div className="">
        <Dropdown userInfo={userData} />
      </div>

      {/* Default Routes */}
      <div>
        <DefaultOptions />
      </div>

      {/* Project List */}
      <div>
        <ProjectList />
      </div>

      {/* New Folder/Projects Button */}
      <div>
        <NewFolderProjectsButton />
      </div>
    </div>
  );
}
