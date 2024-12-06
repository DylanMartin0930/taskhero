import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const getMonthlyData = async (token, setMonthlyData, setHaveData) => {
  try {
    const response = await axios.post("/api/graphs/lineGraphs/getMonthly", {
      token,
    });
    setMonthlyData(response.data);
    setHaveData(true);
    toast.success("Weekly Data Fetch Successful");
  } catch (error) {
    setHaveData(false);
    console.error("Weekly Data Fetch error", error);
    toast.error("Weekly Data Fetch error");
  }
};
