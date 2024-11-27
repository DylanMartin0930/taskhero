import axios, { AxiosError } from "axios";

export const fetchWritableProjects = async (setProjects, canWrite) => {
  try {
    const response = await axios.post("/api/projects/getWritableProjects", {
      canWrite,
    });
    setProjects(response.data.data); // Access the 'data' array from the response
  } catch (error) {
    setProjects([]); // Set the projects to an empty array
    console.error("Error fetching projects:", error);
  }
};
