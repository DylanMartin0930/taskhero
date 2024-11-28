"use client";
import React, { useEffect, useState, useCallback } from "react";
import NewTask from "@/components/ui/newtask-dropdown";
import TaskElement from "./taskelement";
import toast from "react-hot-toast";

export default function TaskListWrapper({ projectId, fetchcall, writeperm }) {
  const [tasks, setTasks] = useState([]);
  const [openTaskIds, setOpenTaskIds] = useState({}); // Track open states by task ID

  const refreshTasks = async () => {
    console.log("ProjectID: ", projectId);
    if (projectId) {
      await fetchcall(projectId, setTasks);

      toast.success("project selected");
    } else {
      toast.error("No project selected");
    }
  };

  useEffect(() => {
    refreshTasks();
  }, [projectId]);

  const toggleTask = (taskId) => {
    setOpenTaskIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId], // Toggle the open state for the specific task
    }));
  };

  return (
    <div className="mb-4 w-full">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskElement key={task._id} task={task} onRefresh={refreshTasks} />
        ))
      ) : (
        <p>No tasks available.</p>
      )}
      <div className="w-full">
        {writeperm && ( // Render NewTask only if writeperm is true
          <NewTask onTaskCreated={refreshTasks} defaultProject={projectId} />
        )}
      </div>
    </div>
  );
}
