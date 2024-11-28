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
    <div
      onDoubleClick={handleToggle}
      className="p-4 hover:bg-gray-200 transition duration-300"
    >
      <div className="flex items-center">
        <IoMdArrowDropdown />
        <h2>{task.title}</h2>
      </div>
      {isOpen && (
        <div>
          <hr />
          <p>{task.description}</p>
          <p>Folder: {task.folder}</p>
          {dueDate && <p>Deadline: {dueDate}</p>}
          <p>Completed on: {formatDate(task.completeDate)}</p>

          <button
            onClick={() =>
              archiveTask(task, currentProjectId, onRefresh, refreshTasks)
            }
            className="bg-red-500 text-white p-2 rounded-md"
          >
            Archive Task
          </button>

          <button
            onClick={() =>
              recoverTask(task, currentProjectId, onRefresh, refreshTasks)
            }
            className="bg-green-500 text-white p-2 rounded-md"
          >
            Recover Task
          </button>
        </div>
      )}
    </div>
  );
}
