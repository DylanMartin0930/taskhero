import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const fetchToday = async (projectId, setTaskList) => {
  try {
    const response = await axios.post("/api/users/getToday", { projectId });
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = await error.response.data.error;
      console.log(error.message);
      toast.error(errorMessage);
    }
  }
};
