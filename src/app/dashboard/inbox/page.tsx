"use client";
import React from "react";
import TaskListWrapper from "@/components/ui/tasklistwrapper";

function Inbox() {
  return (
    <div className="text-black h-screen flex flex-col p-[10px]">
      <h1 className="text-xl mb-4">Inbox</h1>
      <hr />
      <div className="w-full" data-testid="task-list-wrapper">
        <TaskListWrapper folder={"Inbox"} />
      </div>
    </div>
  );
}

export default Inbox;
