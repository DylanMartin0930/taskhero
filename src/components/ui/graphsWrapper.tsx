import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import LineGraph from "./linegraph";

export default function GraphWrapper(props) {
  const [data, setData] = useState([]);
  const [haveData, setHaveData] = useState(false);
  const token = props.token;

  const getData = async () => {
    try {
      const response = await axios.post("/api/graphs/getWeekly", { token });
      console.log("LineGraph Data Fetch Successful", response.data);
      setData(response.data);
      setHaveData(true);
      console.log("LineGraph Data Fetch Successful", response.data.data);
      toast.success("Linegraph Data Fetch Successful");
    } catch (error) {
      setHaveData(false);
      console.error("Login error", error);
      toast.error("Login error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div
      className={`w-full overflow-hidden transition-all duration-500 ease-out ${
        haveData ? "h-auto opacity-100" : "h-0 opacity-0"
      }`}
    >
      {haveData ? (
        <LineGraph token={token} />
      ) : (
        <div
          className="w-full text-black bg-[#d9d9d9] border border-black"
          style={{ height: "400px" }}
        >
          Loading...
        </div>
      )}
    </div>
  );
}
