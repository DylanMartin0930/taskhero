import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const completeTask = async (
  token,
  task,
  onrefresh,
  refetch,
  refreshTasks,
  refreshRegularData,
  refreshPieData,
) => {
  try {
    const response = await axios.post("/api/users/completetask", {
      token,
      task,
    });
    toast.success("Task Completed!");
    onrefresh();
    refetch();
    refreshTasks();
    refreshRegularData(token);
    refreshPieData(token);
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error; // No await needed
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  }
};
