"use client";
import React from "react";
import { useTaskContext } from "../context/DueSoonContext";
import PlainTaskList from "./plaintasklist";

export default function DueSoon() {
  const { tasks, refreshTasks, isLoading } = useTaskContext();

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div
          className="w-full text-black bg-[#d9d9d9] border border-black"
          style={{ height: "400px" }}
        >
          <p>Loading, please wait...</p>{" "}
        </div>
      ) : (
        <>
          {/* PlainTaskList Container */}
          <div className="">
            <PlainTaskList tasks={tasks} />
          </div>
        </>
      )}
    </div>
  );
}
