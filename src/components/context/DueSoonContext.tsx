"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchDueSoon } from "../queries/fetchDueSoon";

interface TaskContextType {
  tasks: any[];
  refreshTasks: () => Promise<void>;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const DueSoonbProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to refresh tasks
  const refreshTasks = async () => {
    if (!token) {
      console.warn("Token is not set, skipping fetch.");
      return;
    }
    setIsLoading(true);
    console.log("Fetching tasks with token:", token);
    await fetchDueSoon(token, setTasks);
    setIsLoading(false);
  };

  useEffect(() => {
    // Extract token from URL and set it
    const urlToken = window.location.search.split("=")[1];
    if (urlToken) {
      console.log("URL Token: ", urlToken);
      setToken(urlToken);
    }
  }, []); // Runs once when the component mounts

  useEffect(() => {
    // Fetch tasks when the token changes
    if (token) {
      refreshTasks();
    }
  }, [token]);

  return (
    <TaskContext.Provider value={{ tasks, refreshTasks, isLoading }}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook for consuming the TaskContext
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
