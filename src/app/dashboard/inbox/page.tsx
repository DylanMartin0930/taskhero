"use client";
import React, { useEffect, useState } from "react";
import NewTask from "@/components/ui/newtask-dropdown";
import TaskListWrapper from "@/components/ui/tasklistwrapper";

function Inbox() {
  return (
    <div className="text-black h-screen flex flex-col p-[10px]">
      <h1 className="text-xl mb-4">Inbox</h1>
      <hr />
      <TaskListWrapper />
    </div>
  );
}

export default Inbox;
