import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const fetchTasks = async (projectId) => {
	console.log("Fetching tasks for project", projectId);
	try {
		const response = await axios.post("/api/users/getTasks", {
			projectId,
		});
		console.log("Tasks fetched successfully", response.data.data);
		return response.data.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const errorMessage = await error.response.data.error;
			console.log(error.message);
			toast.error(errorMessage);
		}
		return [];
	}
};
