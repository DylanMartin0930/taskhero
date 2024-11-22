import axios, { AxiosError } from "axios";

export const fetchProjects = async (setProjects, onRefresh, isDefault) => {
  try {
    const response = await axios.post("/api/projects/getProjectList", {
      isDefault,
    });
    setProjects(response.data.data); // Access the 'data' array from the response
    if (onRefresh) {
      onRefresh();
    } // Call the onRefresh function to refresh the project list
  } catch (error) {
    setProjects([]); // Set the projects to an empty array
    console.error("Error fetching projects:", error);
  }
};
