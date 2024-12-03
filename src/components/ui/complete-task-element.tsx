"use client";
import React, { useState } from "react";
import { archiveTask } from "../queries/archiveTask";
import { recoverTask } from "../queries/recoverTask";
import { useTaskContext } from "../context/DueSoonContext";

import { IoMdArrowDropdown } from "react-icons/io";

export default function CompleteTaskElement({
  task,
  currentProjectId,
  onRefresh,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { refreshTasks } = useTaskContext();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  // Format the date if dueDate is not null
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="bg-[#d9d9d9] border border-black mb-2 p-2 transition duration-300 cursor-pointer">
      <div className="flex items-center">
        <div
          className="flex items-center w-full space-x-2 cursor-pointer hover:bg-[#b3b3b3]"
          onClick={handleToggle} // Apply the click handler to the whole area of the title
        >
          <IoMdArrowDropdown />
          <h2 className="flex-1">{task.title}</h2>
        </div>
      </div>
      {isOpen && (
        <div className="overflow-hidden transition-all duration-300 max-h-[1000px] opacity-100">
          <hr className="border border-black" />
          <p>{task.description}</p>
          <p>Folder: {task.folder}</p>
          {dueDate && <p>Deadline: {dueDate}</p>}
          <p>Completed on: {formatDate(task.completeDate)}</p>

          <div className="flex space-x-2 mt-2">
            <button
              onClick={() =>
                archiveTask(task, currentProjectId, onRefresh, refreshTasks)
              }
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
            >
              Archive Task
            </button>

            <button
              onClick={() =>
                recoverTask(task, currentProjectId, onRefresh, refreshTasks)
              }
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Recover Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
