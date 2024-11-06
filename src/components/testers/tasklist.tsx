import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Tasks } from "@/types/tasks";
import { ul } from "framer-motion/client";
import toast from "react-hot-toast";

const TaskList = () => {
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasksTester = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/tasks");
        setTasks(data);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        if (error instanceof AxiosError) {
          setError("An unexpected error occurred");
        }
      }
    };
    fetchTasksTester();
  }, []);

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (tasks.length === 0) {
    return <div>No tasks found</div>;
  }

  return (
    <ul>
      {tasks.map((tasks) => (
        <li key={tasks.id}>{tasks.title}</li>
      ))}
    </ul>
  );
};

export default TaskList;
