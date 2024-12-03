import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const updateProjectInfo = async (
  token,
  newTitle,
  newColor,
  onRefresh,
  refreshGraphs, // Add refreshGraphs as a parameter
  setIsEditing,
  setProjectInfo,
) => {
  try {
    const response = await axios.post("/api/projects/updateTitle", {
      projectId: token,
      newTitle,
      newColor,
    });
    toast.success(response.data.message);
    onRefresh(); // Refresh the project list
    refreshGraphs(token); // Refresh the graphs
    setProjectInfo((prev) => ({ ...prev, title: newTitle }));
    setIsEditing(false);
  } catch (error: any) {
    toast.error("Failed to update title");
  }
};
