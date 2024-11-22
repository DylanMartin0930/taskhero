import axios, { AxiosError } from "axios";
import { on } from "events";
import toast from "react-hot-toast";
import { useTaskContext } from "../context/DueSoonContext";

export const updateTask = async (editedTask, task, onRefresh, refreshTasks) => {
	try {
		const response = await axios.post("/api/users/updateTask", {
			editedTask,
			task,
		});
		await onRefresh();
		await refreshTasks();
		console.log("Task updated!", response.data);
		toast.success("Task updated!");
	} catch (error: any) {
		if (error instanceof AxiosError) {
			const errorMessage = error.response?.data?.error; // No await needed
			console.log(errorMessage);
			toast.error(errorMessage);
		}
	}
};
