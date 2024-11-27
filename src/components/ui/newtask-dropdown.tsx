"use client";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ProjectDropDown from "./projects-dropdown";
import { useTaskContext } from "../context/DueSoonContext";
import { createTask } from "../queries/createTask";
import { handleInputChange } from "../utils/handleInputChange";

function NewTask(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = useState(props.defaultProject);
  const [projectId, setProjectId] = useState("");
  const { refreshTasks } = useTaskContext();
  const handleDropdown = async () => {
    setIsOpen(!isOpen);
  };
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: null,
    assignedDate: null,
  });

  // Update task.project when selectedProject changes
  useEffect(() => {
    setTask((prevTask) => ({
      ...prevTask,
      project: selectedProject,
      folder: selectedProject ? selectedProject.title : props.folder, // Change folder based on project selection
    }));
  }, [selectedProject, props.folder]); // Re-run when selectedProject or props.folder changes

  //get current projectId from URL
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
    setTask({ title: "", description: "" });
    setIsOpen(false); // Close the dropdown after task creation
  };

  return (
    <div className="absolute ">
      <button
        onClick={handleDropdown}
        className="mt-2 bg-white text-black rounded-md border border-black w-48"
      >
        New Task
      </button>
      {isOpen && (
        <div className="z-40 top-full bg-white text-black mt-[1px] rounded-md border border-black w-[350px] flex flex-col">
          <input
            type="text"
            placeholder="Task Title"
            name="title"
            className="w-full p-2 placeholder-gray-500 border-b border-gray-300 focus:outline-none"
            value={task.title}
            onChange={(e) => handleInputChange(e, setTask)}
          />
          <input
            type="text"
            placeholder="Task Description"
            name="description"
            className="w-full p-2 placeholder-gray-500 border-b border-gray-300 focus:outline-none"
            value={task.description}
            onChange={(e) => handleInputChange(e, setTask)}
          />
          <ProjectDropDown
            userInfo="Select Project"
            setSelectedProject={setSelectedProject}
          />
          <input
            type="date"
            name="dueDate"
            value={task.dueDate?.split("T")[0] || ""}
            onChange={(e) => handleInputChange(e, setTask)}
            className="border rounded p-1 w-full"
          />

          <input
            type="date"
            name="assignedDate"
            value={task.assignedDate?.split("T")[0] || ""}
            onChange={(e) => handleInputChange(e, setTask)}
            className="border rounded p-1 w-full"
          />

          <button
            onClick={onSubmit}
            className="bg-blue-500 w-[150px] text-white p-2 rounded-md mt-2"
          >
            Create Task
          </button>
        </div>
      )}
    </div>
  );
}

export default NewTask;
