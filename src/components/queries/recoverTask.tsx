import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const recoverTask = async (
  task,
  currentProjectId,
  onrefresh,
  refreshTasks,
) => {
  try {
    const response = await axios.post("/api/logbook/recoverTask", {
      task,
      currentProjectId,
    });
    toast.success("Task Recovered!");
    onrefresh();
    refreshTasks();
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error; // No await needed
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  }
};
