import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const fetchDueSoon = async (projectId, setTaskList) => {
	try {
		const response = await axios.post("/api/users/getDueSoon", {
			projectId,
		});
		setTaskList(response.data.data);
		console.log("Task Completed!", response.data);
		toast.success("Task Completed!");
	} catch (error: any) {
		if (error instanceof AxiosError) {
			const errorMessage = error.response?.data?.error; // No await needed
			console.log(errorMessage);
			toast.error(errorMessage);
		}
	}
};
