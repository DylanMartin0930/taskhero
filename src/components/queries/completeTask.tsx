import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const completeTask = async (
  token,
  taskId,
  onrefresh,
  refreshTasks,
  refreshGraphs,
) => {
  try {
    const response = await axios.post("/api/users/completetask", {
      token,
      taskId,
    });
    console.log("Task Completed!", response.data);
    toast.success("Task Completed!");
    onrefresh();
    refreshTasks();
    refreshGraphs(token);
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error; // No await needed
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  }
};
