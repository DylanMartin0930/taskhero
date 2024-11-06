import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const completeTask = async (taskId, onTaskComplete) => {
  try {
    const response = await axios.post("/api/users/completetask", { taskId });
    console.log("Task Completed!", response.data);
    toast.success("Task Completed!");
    onTaskComplete(); // Call the parent function to refresh tasks
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error; // No await needed
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  }
};
