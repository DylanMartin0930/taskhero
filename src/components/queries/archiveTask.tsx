import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const archiveTask = async (
  task,
  currentProjectId,
  onrefresh,
  refreshTasks,
) => {
  try {
    const response = await axios.post("/api/logbook/archiveTask", {
      task,
      currentProjectId,
    });
    console.log("Task Archived!", response.data);
    toast.success("Task Archived!");
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
