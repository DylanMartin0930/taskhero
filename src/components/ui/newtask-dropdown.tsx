"use client";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ProjectDropDown from "./projects-dropdown";
import { useTaskContext } from "../context/DueSoonContext";
import { createTask } from "../queries/createTask";
import { handleInputChange } from "../utils/handleInputChange";
import { AiTwotoneCalendar } from "react-icons/ai";
import DatePicker from "react-datepicker";

function NewTask(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(props.defaultProject);
  const [projectId, setProjectId] = useState("");
  const { refreshTasks } = useTaskContext();
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: null,
    assignedDate: null,
  });

  const handleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Update task.project when selectedProject changes
  useEffect(() => {
    setTask((prevTask) => ({
      ...prevTask,
      project: selectedProject,
      folder: selectedProject ? selectedProject.title : props.folder,
    }));
  }, [selectedProject, props.folder]);

  // Get current projectId from URL
  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setProjectId(urlToken || "");
  }, []);

  const onSubmit = async () => {
    const updatedTask = {
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      assignedDate: task.assignedDate
        ? new Date(task.assignedDate).toISOString()
        : null,
    };
    createTask(updatedTask, selectedProject, props.onTaskCreated, refreshTasks);
    setTask({ title: "", description: "", dueDate: null, assignedDate: null });
    setIsOpen(false); // Close the dropdown after task creation
  };

  return (
    <div className="absolute">
      <button
        onClick={handleDropdown}
        className="mt-2 bg-[#d9d9d9] text-black border border-black w-48"
      >
        New Task
      </button>
      {isOpen && (
        <div className="z-40 top-full bg-[#d9d9d9] text-black mt-[1px] border border-black w-[350px] flex flex-col shadow-md shadow-black">
          <input
            type="text"
            placeholder="Task Title"
            name="title"
            className=" w-full p-2 placeholder-gray-500 border-b border-gray-300 focus:outline-none"
            value={task.title}
            onChange={(e) => handleInputChange(e, setTask)}
          />
          <hr className="border-1 border-black" />
          <textarea
            name="description"
            value={task.description}
            onChange={(e) => handleInputChange(e, setTask)}
            className="border  p-1 w-full  placeholder-gray-500"
            placeholder="Task Description"
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
            <AiTwotoneCalendar
              className="text-black text-xl"
              size={40} // Icon size adjusted
            />
            <DatePicker
              selected={task.dueDate ? new Date(task.dueDate) : null}
              onChange={(date) =>
                setTask((prevTask) => ({
                  ...prevTask,
                  dueDate: date ? date.toISOString() : null,
                }))
              }
              placeholderText="Select Due Date"
              className="hover:bg-[#b3b3b3] p-2 placeholder-gray-500 border-b border-gray-300 focus:outline-none cursor-pointer"
            />
          </div>
          <hr className="border-1 border-black" />

          {/* Assigned Date Section */}
          <div className="pl-2 flex items-center space-x-2">
            <AiTwotoneCalendar
              className="text-black text-xl"
              size={40} // Icon size adjusted
            />
            <DatePicker
              selected={task.assignedDate ? new Date(task.assignedDate) : null}
              onChange={(date) =>
                setTask((prevTask) => ({
                  ...prevTask,
                  assignedDate: date ? date.toISOString() : null,
                }))
              }
              placeholderText="Select Assigned Date"
              className="hover:bg-[#b3b3b3] p-2 placeholder-gray-500 border-b border-gray-300 focus:outline-none cursor-pointer"
            />
          </div>
          <hr className="border-1 border-black" />

          <button
            onClick={onSubmit}
            className="hover:bg-[#b3b3b3] border-r border-black p-2 w-fit"
          >
            Create Task
          </button>
        </div>
      )}
    </div>
  );
}

export default NewTask;
