"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProjectDropDown from "./projects-dropdown";

function NewTask(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = useState(props.defaultProject);
  const [projectId, setProjectId] = useState("");
  const handleDropdown = async () => {
    setIsOpen(!isOpen);
  };
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: null,
    asssignedDate: null,
  });

  // Update task.project when selectedProject changes
  useEffect(() => {
    setTask((prevTask) => ({
      ...prevTask,
      project: selectedProject,
      folder: selectedProject ? selectedProject.title : props.folder, // Change folder based on project selection
    }));
  }, [selectedProject, props.folder]); // Re-run when selectedProject or props.folder changes

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setProjectId(urlToken || "");
  }, []);

  const onSubmit = async () => {
    console.log("NEW TASK PROJECT ID: ", task.project);
    try {
      const response = await axios.post("/api/users/createtask", {
        task,
        selectedProject,
      });
      console.log("Task created successfully", response.data);
      toast.success("Task created successfully");
      setTask({ title: "", description: "" });
      setIsOpen(false); // Close the dropdown after task creation
      props.onTaskCreated(); // Call the parent function to refresh tasks
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error; // No await needed
        console.log(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const handleDueDateChange = (date) => {
    // Set dueDate to the selected date or null if cleared
    if (date) {
      const adjustedDate = new Date(date);
      adjustedDate.setUTCHours(23, 59, 59, 999); // Adjust to one minute before midnight
      setTask((prevTask) => ({ ...prevTask, dueDate: adjustedDate }));
    } else {
      setTask((prevTask) => ({ ...prevTask, dueDate: null })); // Set dueDate to null if no date is selected
    }
  };

  const handleAssignedDateChange = (date) => {
    // Set dueDate to the selected date or null if cleared
    if (date) {
      const adjustedDate = new Date(date);
      adjustedDate.setUTCHours(23, 59, 59, 999); // Adjust to one minute before midnight
      setTask((prevTask) => ({ ...prevTask, assignedDate: adjustedDate }));
    } else {
      setTask((prevTask) => ({ ...prevTask, assignedDate: null })); // Set dueDate to null if no date is selected
    }
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
            className="w-full p-2 placeholder-gray-500 border-b border-gray-300 focus:outline-none"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Task Description"
            className="w-full p-2 placeholder-gray-500 border-b border-gray-300 focus:outline-none"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
          <ProjectDropDown
            userInfo="Select Project"
            setSelectedProject={setSelectedProject}
          />
          <DatePicker
            placeholderText="Due Date (MM/DD/YYYY)"
            dateFormat={"MM/dd/yyyy"}
            selected={task.dueDate}
            onChange={(date) => handleDueDateChange(date)}
            className="w-full p-2 mt-2 bg-gray-200 rounded-md text-left"
            isClearable
          />

          <DatePicker
            placeholderText="Assigned Date(MM/DD/YYYY)"
            dateFormat={"MM/dd/yyyy"}
            selected={task.assignedDate}
            onChange={(date) => handleAssignedDateChange(date)}
            className="w-full p-2 mt-2 bg-gray-200 rounded-md text-left"
            isClearable
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
