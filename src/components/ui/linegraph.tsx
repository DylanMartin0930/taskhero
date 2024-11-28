import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function LineGraph(props) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [haveData, setHaveData] = useState(false);
  const [isWeekly, setIsWeekly] = useState(true); // State to track whether we're viewing weekly or monthly data
  const token = props.token;

  // Fetch Weekly Data
  const getWeeklyData = async () => {
    try {
      const response = await axios.post("/api/graphs/getWeekly", { token });
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

  // Fetch Monthly Data
  const getMonthlyData = async () => {
    try {
      const response = await axios.post("/api/graphs/getMonthly", { token });
      console.log("LineGraph Monthly Data Fetch Successful", response.data);
      setMonthlyData(response.data);
      setHaveData(true);
      toast.success("Monthly Data Fetch Successful");
    } catch (error) {
      setHaveData(false);
      console.error("Monthly Data Fetch error", error);
      toast.error("Monthly Data Fetch error");
    }
  };

  // Fetch both sets of data on initial load
  useEffect(() => {
    getWeeklyData();
    getMonthlyData();
  }, []);

  // Switch between weekly and monthly data
  const handleToggle = (type: string) => {
    setIsWeekly(type === "weekly"); // Toggle between true (weekly) and false (monthly)
  };

  // Determine which data to use based on the toggle state
  const currentData = isWeekly ? weeklyData : monthlyData;
  const testData = {
    labels: currentData.labels, // Use the labels from the selected data (weekly or monthly)
    datasets: [
      {
        label: currentData.datasets?.[0]?.label, // Access the label of the first dataset
        data: currentData.datasets?.[0]?.data, // Access the data of the first dataset
        borderColor: "rgb(0, 0, 0)", // Set the line color to black
        fill: false, // Ensure the area under the line is not filled
        tension: 0.1, // Adjust the line smoothness
        pointRadius: 6, // Set the size of the points on the graph
        pointHoverRadius: 8, // Set the size of the points when hovered over
      },
    ],
  };

  // Update the options to enforce whole numbers on the y-axis and label it as "Task Completed"
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true, // Display the x-axis title
          text: isWeekly ? "Last 7 Days" : "Last 30 Days", // Label for the x-axis
          font: {
            size: 14, // Adjust the font size of the title
            weight: "bold", // Make the title bold
            color: "rgb(0, 0, 0)", // Make the x-axis title black
          },
        },
        ticks: {
          autoSkip: true, // Skip ticks if there is not enough space
          maxRotation: 45, // Limit the rotation of labels
          minRotation: 0, // Minimum rotation angle
          font: {
            size: 10, // Reduce the font size for compact labels
            color: "rgb(0, 0, 0)", // Make the tick labels black
          },
        },
      },
      y: {
        title: {
          display: true, // Display the y-axis title
          text: "Task Completed", // Label for the y-axis
          font: {
            size: 14, // Adjust the font size of the title
            weight: "bold", // Make the title bold
            color: "rgb(0, 0, 0)", // Make the y-axis title black
          },
        },
        ticks: {
          beginAtZero: true, // Start from zero
          stepSize: 1, // Force the y-axis to use whole numbers
          callback: function (value) {
            return value % 1 === 0 ? value : ""; // Only display whole numbers
          },
          font: {
            color: "rgb(0, 0, 0)", // Make the tick labels black
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgb(0, 0, 0)", // Make legend labels black
        },
      },
    },
  };

  return (
    <div className="bg-[#777777] text-black flex flex-col justify-between items-center w-full h-1/2 md:h-full p-[10px]">
      {/* Toggle Button */}
      <div>
        <button
          onClick={() => handleToggle("weekly")}
          className={`border-black p-1 mb-2 ${isWeekly ? "bg-[#b3b3b3] text-black border border-black" : "bg-[#d9d9d9] text-black"}`}
        >
          Weekly
        </button>

        <button
          onClick={() => handleToggle("monthly")}
          className={`p-1 mb-2 ${isWeekly ? "bg-[#d9d9d9] text-black" : "bg-[#b3b3b3] text-black border border-black"}`}
        >
          Monthly
        </button>
      </div>

      {/* Line Graph Wrapper with smooth transition */}
      <div
        className={`w-full text-black bg-[#d9d9d9] border border-black overflow-hidden transition-all duration-500 ease-out ${
          haveData ? "h-auto opacity-100" : "h-0 opacity-0"
        }`}
        style={{ height: "400px" }}
      >
        {haveData ? (
          <Line options={options} data={testData} />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
