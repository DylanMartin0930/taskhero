"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function NewTask({ onTaskCreated }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleDropdown = async () => {
    setIsOpen(!isOpen);
  };
  const [task, setTask] = useState({
    title: "",
    description: "",
  });

  const onSubmit = async () => {
    try {
      const response = await axios.post("/api/users/createtask", task);
      console.log("Task created successfully", response.data);
      toast.success("Task created successfully");
      setTask({ title: "", description: "" });
      setIsOpen(false); // Close the dropdown after task creation
      onTaskCreated(); // Call the parent function to refresh tasks
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error; // No await needed
        console.log(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="absolute">
      <button
        onClick={handleDropdown}
        className="mt-2 bg-white text-black rounded-md border border-black w-48"
      >
        New Task
      </button>
      {isOpen && (
        <div className="z-40 top-full bg-white text-black mt-[1px] rounded-md border border-black w-48">
          <input
            type="text"
            placeholder="Task Title"
            className="border-2 border-gray-300 rounded-md p-2 w-[150px]"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Task Description"
            className="border-2 border-gray-300 rounded-md p-2 w-[150px]"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
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
