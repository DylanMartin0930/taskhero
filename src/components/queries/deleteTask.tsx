import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const deleteTasks = async (
  projectId,
  taskId,
  onTaskDeleted,
  refreshTasks,
) => {
  try {
    const response = await axios.post("/api/users/deletetask", {
      projectId,
      taskId,
    });
    toast.success(response.data.message);
    onTaskDeleted(); // Call the parent function to refresh tasks
    refreshTasks();
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error; // No await needed
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  }
};
