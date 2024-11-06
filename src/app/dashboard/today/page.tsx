"use client";
import React from "react";
import TaskListWrapper from "@/components/ui/tasklistwrapper";

function Inbox() {
  return (
    <div className="text-black h-screen flex flex-col p-[10px]">
      <h1 className="text-xl mb-4">Today</h1>
      <hr />
      <div className="w-full">
        <TaskListWrapper folder={"Today"} />
      </div>
    </div>
  );
}

export default Inbox;
