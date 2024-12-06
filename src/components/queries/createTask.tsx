import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const createTask = async (
  task,
  selectedProject,
  ontaskCreated,
  refreshTasks,
) => {
  try {
    const response = await axios.post("/api/users/createtask", {
      task: task,
      selectedProject,
    });
    toast.success("Task Created!");
    ontaskCreated();
    refreshTasks();
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error; // No await needed
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  }
};
