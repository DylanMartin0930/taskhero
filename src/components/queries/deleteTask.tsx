import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const deleteTasks = async (taskId, onTaskDeleted) => {
  try {
    const response = await axios.post("/api/users/deletetask", { taskId });
    console.log("Task Deleted successfully", response.data);
    toast.success("Task Deleted successfully");
    onTaskDeleted(); // Call the parent function to refresh tasks
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error; // No await needed
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  }
};
