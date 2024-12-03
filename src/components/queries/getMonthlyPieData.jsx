import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const getMonthlyPieData = async (token, setMonthlyData, setHaveData) => {
  try {
    const response = await axios.post("/api/graphs/pieChart/getMonthly", {
      token,
    });
    console.log("LineGraph Weekly Data Fetch Successful", response.data);
    setMonthlyData(response.data);
    setHaveData(true);
    toast.success("Weekly Data Fetch Successful");
  } catch (error) {
    setHaveData(false);
    console.error("Weekly Data Fetch error", error);
    toast.error("Weekly Data Fetch error");
  }
};
