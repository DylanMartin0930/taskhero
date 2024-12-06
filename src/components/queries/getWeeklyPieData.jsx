import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const getWeeklyPieData = async (
	token,
	filter,
	setWeeklyPieData,
	setHaveWeeklyPieData
) => {
	try {
		const response = await axios.post("/api/graphs/pieChart/getWeekly", {
			token,
			filter,
		});
		setWeeklyPieData(response.data);
		setHaveWeeklyPieData(true);
		toast.success("Weekly Data Fetch Successful");
	} catch (error) {
		setHaveWeeklyPieData(false);
		console.error("Weekly Data Fetch error", error);
		toast.error("Weekly Data Fetch error");
	}
};
