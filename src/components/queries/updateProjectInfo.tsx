import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const updateProjectInfo = async (
  token,
  newTitle,
  newColor,
  onRefresh,
  refreshRegularData, // Add refreshGraphs as a parameter
  refreshPieData,
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
    refreshRegularData(token); // Refresh the graphs
    refreshPieData(token);
    setProjectInfo((prev) => ({ ...prev, title: newTitle }));
    setIsEditing(false);
  } catch (error: any) {
    toast.error("Failed to update title");
  }
};
