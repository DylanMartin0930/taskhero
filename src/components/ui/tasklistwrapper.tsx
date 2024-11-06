"use client";
import React, { useEffect, useState, useCallback } from "react";
import { fetchTasks } from "@/components/queries/fetchTasks";
import NewTask from "@/components/ui/newtask-dropdown";
import TaskElement from "./taskelement";

export default function TaskListWrapper({ folder }) {
  const [tasks, setTasks] = useState([]);
  const [openTaskIds, setOpenTaskIds] = useState({}); // Track open states by task ID

  const refreshTasks = useCallback(async () => {
    await fetchTasks(setTasks, folder);
  }, [folder]);

  useEffect(() => {
    refreshTasks();
  }, []);

  const toggleTask = (taskId) => {
    setOpenTaskIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId], // Toggle the open state for the specific task
    }));
  };

  return (
    <div className="mb-4 w-full bg-purple-100">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskElement
            key={task._id}
            task={task}
            isOpen={openTaskIds[task._id]} // Pass the open state
            onToggle={() => toggleTask(task._id)} // Pass toggle function
            onRefresh={refreshTasks}
          />
        ))
      ) : (
        <p>No tasks available.</p>
      )}
      <div className="w-full">
        <NewTask onTaskCreated={refreshTasks} />
      </div>
    </div>
  );
}
