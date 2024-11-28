"use client";
import React, { useEffect, useState, useCallback } from "react";
import CompleteTaskElement from "./complete-task-element";
import toast from "react-hot-toast";

export default function LogBookWrapper({ projectId, fetchcall, writeperm }) {
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

  return (
    <div className="mb-4 w-full bg-purple-100">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <CompleteTaskElement
            key={task._id}
            task={task}
            onRefresh={refreshTasks}
            currentProjectId={projectId}
          />
        ))
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
}
