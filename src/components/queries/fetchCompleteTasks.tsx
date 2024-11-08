import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const fetchCompleteTasks = async (setTaskList) => {
  try {
    const response = await axios.post("/api/users/getCompleteTasks");
    setTaskList(response.data.data); // Ensure data structure is correct
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = await error.response.data.error;
      console.log(error.message);
      toast.error(errorMessage);
    }
  }
};
