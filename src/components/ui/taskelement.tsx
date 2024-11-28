"use client";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import { useTaskContext } from "../context/DueSoonContext";
import { completeTask } from "../queries/completeTask";
import { deleteTasks } from "../queries/deleteTask";
import { updateTask } from "../queries/updateTask";
import { handleInputChange } from "../utils/handleInputChange";
import { AiTwotoneCalendar } from "react-icons/ai";
import DatePicker from "react-datepicker";
import ProjectDropDown from "./projects-dropdown";

export default function TaskElement({ task, onRefresh }) {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    parent: task.parent,
    description: task.description,
    folder: task.folder,
    dueDate: task.dueDate,
    assignedDate: task.assignedDate,
  });

  const { refreshTasks } = useTaskContext();

  // Fetch the token from the URL when the component mounts
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken || "");
  }, []);

  // Complete task handler
  const handleCheckbox = async (event) => {
    if (event.target.checked) {
      await completeTask(token, task._id, onRefresh, refreshTasks);
    }
  };

  const handleToggle = () => setIsOpen((prev) => !prev);

  // Save edited task after validation
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

    // API call to update task
    await updateTask(
      updatedTask,
      task,
      selectedProject,
      onRefresh,
      refreshTasks,
    );

    setIsEditing(false);
    onRefresh(); // Refresh task list after saving
  };

  // Format dates (due date and assigned date) for display
  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString("en-US", {
          timeZone: "UTC",
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      : null;
  };

  const dueDate = formatDate(task.dueDate);
  const assignedDate = formatDate(task.assignedDate);

  return (
    <div
      className={`bg-[#d9d9d9] border border-black mb-2 ${isOpen ? "shadow-md shadow-black" : ""}`}
      onClick={handleToggle}
    >
      <div className="p-2 hover:bg-[#b3b3b3] transition duration-300">
        <div className="flex items-center">
          {isOpen ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
          <input
            type="checkbox"
            className="mr-2"
            checked={task.completed}
            onClick={(e) => e.stopPropagation()} // Prevent checkbox click from toggling the parent
            onChange={handleCheckbox}
          />
          <h2>{task.title}</h2>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <hr className="border border-black" />
          {isEditing ? (
            <div className="space-y-2 mt-1">
              {/* Edit Mode */}
              <input
                type="text"
                name="title"
                value={editedTask.title}
                onChange={(e) => handleInputChange(e, setEditedTask)}
                className="border p-1 w-full bg-[]"
                onClick={(e) => e.stopPropagation()} // Prevent click from propagating
              />
              <hr className="border-1 border-black" />

              <textarea
                name="description"
                value={editedTask.description}
                onChange={(e) => handleInputChange(e, setEditedTask)}
                className="border p-1 w-full"
                onClick={(e) => e.stopPropagation()} // Prevent click from propagating
              />
              <hr className="border-1 border-black" />

              <ProjectDropDown
                userInfo="Select Project"
                setSelectedProject={setSelectedProject}
              />
              <hr className="border-1 border-black" />

              {/* Due Date Section */}
              <div className="pl-2 flex items-center space-x-2">
                <label htmlFor="dueDate" className="w-24">
                  Due Date:
                </label>
                <AiTwotoneCalendar
                  className="text-black text-xl"
                  size={40} // Icon size adjusted
                />
                <DatePicker
                  selected={
                    editedTask.dueDate ? new Date(editedTask.dueDate) : null
                  }
                  onChange={(date) =>
                    setTask((prevTask) => ({
                      ...prevTask,
                      dueDate: date ? date.toISOString() : null,
                    }))
                  }
                  placeholderText="Select Date"
                  className=" p-2 placeholder-gray-500 border-b border-gray-300 focus:outline-none cursor-pointer"
                />
              </div>
              <hr className="border-1 border-black" />

              {/* Due Date Section */}
              <div className="pl-2 flex items-center space-x-2 ">
                <label htmlFor="dueDate" className="w-24">
                  Assigned Date:
                </label>
                <AiTwotoneCalendar
                  className="text-black text-xl"
                  size={40} // Icon size adjusted
                />
                <DatePicker
                  selected={
                    editedTask.assignedDate
                      ? new Date(editedTask.assignedDate)
                      : null
                  }
                  onChange={(date) =>
                    setTask((prevTask) => ({
                      ...prevTask,
                      assignedDate: date ? date.toISOString() : null,
                    }))
                  }
                  placeholderText="Select Date"
                  className=" p-2 placeholder-gray-500 border-b border-gray-300 focus:outline-none cursor-pointer"
                />
              </div>
              <hr className="border-1 border-black" />

              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating
                    saveEditedTask();
                  }}
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating
                    setIsEditing(false);
                  }}
                  className="bg-gray-500 text-white px-4 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* View Mode */}
              <p>{task.description}</p>
              <p>Folder: {task.folder}</p>
              {dueDate && <p>Deadline: {dueDate}</p>}
              {assignedDate && <p>Assigned for: {assignedDate}</p>}
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating
                    deleteTasks(token, task._id, onRefresh, refreshTasks);
                  }}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating
                    setIsEditing(true);
                  }}
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
