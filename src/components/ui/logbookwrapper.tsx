"use client";
import React, { useEffect } from "react";
import { fetchCompleteTasks } from "@/components/queries/fetchCompleteTasks";
import CompleteTaskElement from "./complete-task-element";

export default function LogbookWrapper({ folder }) {
  const [tasks, setTasks] = React.useState([]); // Initialize tasks state

  const refreshTasks = async () => {
    await fetchCompleteTasks(setTasks); // Fetch tasks and update state
  };

  useEffect(() => {
    fetchCompleteTasks(setTasks);
  }, []);

  return (
    <div className="mb-4 w-full">
      {tasks.length > 0 ? ( // Check if tasks have items
        tasks.map((t, index) => (
          <div key={index} className="border p-2 mb-2 rounded-md">
            <CompleteTaskElement task={t} deleteTodo={refreshTasks} />
          </div>
        ))
      ) : (
        <p>No tasks available.</p> // Message when no tasks are found
      )}
    </div>
  );
}
