import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const getMonthlyPieData = async (
  token,
  filter,
  setMonthlyPieData,
  setHaveMonthlyPieData,
) => {
  try {
    const response = await axios.post("/api/graphs/pieChart/getMonthly", {
      token,
      filter,
    });
    setMonthlyPieData(response.data);
    setHaveMonthlyPieData(true);
    toast.success("Weekly Data Fetch Successful");
  } catch (error) {
    setHaveMonthlyPieData(false);
    console.error("Weekly Data Fetch error", error);
    toast.error("Weekly Data Fetch error");
  }
};
