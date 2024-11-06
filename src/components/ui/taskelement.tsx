"use client";
import React from "react";
import { deleteTasks } from "../queries/deleteTask";
import { completeTask } from "../queries/completeTask";
import { FaTrash } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

export default function TaskElement({ task, isOpen, onToggle, onRefresh }) {
  //only complete task if checkbox is checked
  const handleCheckbox = async (event) => {
    if (event.target.checked) {
      await completeTask(task._id, onRefresh);
    }
  };

  // Format the date if dueDate is not null
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;

  const assignedDate = task.assignedDate
    ? new Date(task.assignedDate).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="border p-2 mb-2 rounded-md">
      <div
        onDoubleClick={onToggle}
        className="p-4 hover:bg-gray-200 transition duration-300"
      >
        <div className="flex items-center">
          <IoMdArrowDropdown />
          <input
            type="checkbox"
            className="mr-2"
            defaultChecked={task.completed}
            onClick={handleCheckbox}
          />
          <h2>{task.title}</h2>
        </div>
        {isOpen && (
          <div>
            <hr />
            <p>{task.description}</p>
            <p>Folder: {task.folder}</p>
            {dueDate && <p>Deadline: {dueDate}</p>}
            {assignedDate && <p>Assigned for : {assignedDate}</p>}
            <button onClick={() => deleteTasks(task._id, onRefresh)}>
              <FaTrash />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
