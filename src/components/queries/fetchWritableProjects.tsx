import axios, { AxiosError } from "axios";

export const fetchWritableProjects = async (canWrite) => {
  try {
    const response = await axios.post("/api/projects/getWritableProjects", {
      canWrite,
    });
    return response.data.data; // Access the 'data' array from the response
  } catch (error) {
    setProjects([]); // Set the projects to an empty array
    console.error("Error fetching projects:", error);
  }
};
