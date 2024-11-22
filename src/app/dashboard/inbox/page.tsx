"use client";
import React, { useState, useEffect } from "react";
import TaskListWrapper from "@/components/ui/tasklistwrapper";
import { fetchTasks } from "@/components/queries/fetchTasks";

function Inbox() {
  const [token, setToken] = useState("");
  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    console.log("url Token from inbox:", urlToken);
    setToken(urlToken || "");
  }, []);
  return (
    <div className="text-black h-screen flex flex-col p-[10px]">
      <h1 className="text-xl mb-4">Inbox</h1>
      <hr />
      <div className="w-full" data-testid="task-list-wrapper">
        <TaskListWrapper
          projectId={token}
          fetchcall={fetchTasks}
          writeperm={true}
        />
      </div>
    </div>
  );
}

export default Inbox;
