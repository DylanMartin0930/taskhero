import axios from "axios";
import toast from "react-hot-toast";

export const getProjectInfo = async (token, setProjectInfo, setIsLoading) => {
  try {
    if (!token) return; // Ensure we don't proceed if token is empty
    console.log("Token: ", token);
    setIsLoading(true); // Set loading to true before starting the request
    const response = await axios.post("/api/projects/projectInfo", {
      token,
    });
    toast.success(response.data.message);
    setProjectInfo(response.data.data);
  } catch (error: any) {
    toast.error("Something went wrong");
    toast.error(error.message);
  } finally {
    setIsLoading(false); // Set loading to false after the request completes (either success or error)
  }
};
