import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const deleteProject = async (projectId) => {
  try {
    const response = await axios.post("/api/projects/deleteProject", {
      projectId,
    });
    toast.success(response.data.message);
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error; // No await needed
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  }
};
