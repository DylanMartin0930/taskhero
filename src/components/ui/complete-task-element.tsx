"use client";
import React, { useState } from "react";
import { deleteTasks } from "../queries/deleteTask";

import { IoMdArrowDropdown } from "react-icons/io";

export default function CompleteTaskElement({ task, deleteTodo }) {
  const [isOpen, setIsOpen] = useState(false);

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
            onClick={() => deleteTasks(task._id, deleteTodo)}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Delete Task
          </button>
        </div>
      )}
    </div>
  );
}
