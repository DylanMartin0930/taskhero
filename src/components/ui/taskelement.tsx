"use client";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useTaskContext } from "../context/DueSoonContext";
import { completeTask } from "../queries/completeTask";
import { deleteTasks } from "../queries/deleteTask";
import { updateTask } from "../queries/updateTask";
import { handleInputChange } from "../utils/handleInputChange";
import ProjectDropDown from "./projects-dropdown";

export default function TaskElement({ task, onRefresh }) {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle editing mode
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    parent: task.parent,
    description: task.description,
    folder: task.folder,
    dueDate: task.dueDate,
    assignedDate: task.assignedDate,
  });
  const { refreshTasks } = useTaskContext();

  // Complete task handler
  const handleCheckbox = async (event) => {
    if (event.target.checked) {
      await completeTask(token, task._id, onRefresh, refreshTasks);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const saveEditedTask = async () => {
    const updatedTask = {
      ...editedTask,
      dueDate: editedTask.dueDate
        ? new Date(editedTask.dueDate).toISOString()
        : null,
      assignedDate: editedTask.assignedDate
        ? new Date(editedTask.assignedDate).toISOString()
        : null,
    };
    // Add API call to save updated task here
    updateTask(updatedTask, task, selectedProject, onRefresh, refreshTasks);

    console.log("Saving edited task:", updatedTask);
    setIsEditing(false);
    onRefresh(); // Refresh task list
  };

  // Format the date if dueDate is not null
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        timeZone: "UTC",
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;

  const assignedDate = task.assignedDate
    ? new Date(task.assignedDate).toLocaleDateString("en-US", {
        timeZone: "UTC",
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  return (
    <div className="border p-2 mb-2 rounded-md" onDoubleClick={handleToggle}>
      <div className="p-4 hover:bg-gray-200 transition duration-300">
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
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="title"
                  value={editedTask.title}
                  onChange={(e) => handleInputChange(e, setEditedTask)}
                  className="border rounded p-1 w-full"
                />
                <textarea
                  name="description"
                  value={editedTask.description}
                  onChange={(e) => handleInputChange(e, setEditedTask)}
                  className="border rounded p-1 w-full"
                />
                <ProjectDropDown
                  userInfo="Select Project"
                  setSelectedProject={setSelectedProject}
                />
                <input
                  type="date"
                  name="dueDate"
                  value={editedTask.dueDate?.split("T")[0] || ""}
                  onChange={(e) => handleInputChange(e, setEditedTask)}
                  className="border rounded p-1 w-full"
                />
                <input
                  type="date"
                  name="assignedDate"
                  value={editedTask.assignedDate?.split("T")[0] || ""}
                  onChange={(e) => handleInputChange(e, setEditedTask)}
                  className="border rounded p-1 w-full"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={saveEditedTask}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p>{task.description}</p>
                <p>Folder: {task.folder}</p>
                {dueDate && <p>Deadline: {dueDate}</p>}
                {assignedDate && <p>Assigned for: {assignedDate}</p>}
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      deleteTasks(token, task._id, onRefresh, refreshTasks)
                    }
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
