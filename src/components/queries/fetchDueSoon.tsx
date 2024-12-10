import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const fetchDueSoon = async (projectId, setTaskList) => {
	try {
		const response = await axios.post("/api/users/getDueSoon", {
			projectId,
		});

		if (response.data.data) {
			setTaskList(response.data.data);
		}

		return response.data.data;
	} catch (error: any) {
		if (error instanceof AxiosError) {
			const errorMessage = error.response?.data?.error;
			console.log(errorMessage);
			toast.error(errorMessage);
		}
		return [];
	}
};
