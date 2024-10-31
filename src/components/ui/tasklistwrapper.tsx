import React, { useEffect } from "react";
import { fetchTasks } from "@/components/queries/fetchTasks";
import NewTask from "@/components/ui/newtask-dropdown";
import TaskElement from "./task-element";

export default function TaskListWrapper() {
  const [tasks, setTasks] = React.useState([]); // Initialize tasks state

  const refreshTasks = async () => {
    await fetchTasks(setTasks, "Inbox"); // Fetch tasks and update state
  };

  useEffect(() => {
    fetchTasks(setTasks, "Inbox");
  }, []);

  return (
    <div className="mb-4">
      {tasks.length > 0 ? ( // Check if tasks have items
        tasks.map((t, index) => (
          <div key={index} className="border p-2 mb-2 rounded-md">
            <TaskElement task={t} deleteTodo={refreshTasks} />
          </div>
        ))
      ) : (
        <p>No tasks available.</p> // Message when no tasks are found
      )}
      <div>
        <NewTask onTaskCreated={refreshTasks} />
      </div>
    </div>
  );
}
