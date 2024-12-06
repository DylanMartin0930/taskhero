import axios from "axios";
import toast from "react-hot-toast";

export const getProjectInfo = async (token) => {
  try {
    if (!token) return; // Ensure we don't proceed if token is empty
    const response = await axios.post("/api/projects/projectInfo", {
      token,
    });
    toast.success(response.data.message);
    return response.data.data;
  } catch (error: any) {
    toast.error("Something went wrong");
    toast.error(error.message);
  }
};
