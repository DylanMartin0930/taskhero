import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const getWeeklyPieData = async (token, setWeeklyData, setHaveData) => {
  try {
    const response = await axios.post("/api/graphs/pieChart/getWeekly", {
      token,
    });
    console.log("LineGraph Weekly Data Fetch Successful", response.data);
    setWeeklyData(response.data);
    setHaveData(true);
    toast.success("Weekly Data Fetch Successful");
  } catch (error) {
    setHaveData(false);
    console.error("Weekly Data Fetch error", error);
    toast.error("Weekly Data Fetch error");
  }
};
