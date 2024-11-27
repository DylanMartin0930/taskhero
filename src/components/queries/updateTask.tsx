import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const updateTask = async (
  editedTask,
  task,
  selectedProject,
  onRefresh,
  refreshTasks,
) => {
  try {
    const response = await axios.post("/api/users/updateTask", {
      task,
      editedTask,
      selectedProject,
    });

    await onRefresh();
    await refreshTasks();
    await refreshDueSoon();
    console.log("Task updated!", response.data);
    toast.success("Task updated!");
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error; // No await needed
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  }
};
