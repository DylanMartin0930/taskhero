import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const fetchCompletedTasks = async (projectId, setTaskList) => {
  try {
    const response = await axios.post("/api/users/getCompleted", {
      projectId,
    });
    setTaskList(response.data.data);
    toast.success("Task Completed!");
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error; // No await needed
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  }
};
