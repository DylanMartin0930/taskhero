import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import { useGraphContext } from "../context/GraphContext";

ChartJS.register(Tooltip, Legend, ArcElement);

export default function PieChart() {
  // Use the GraphContext to get data
  const { weeklyPieData, monthlyPieData } = useGraphContext();

  const [isWeekly, setIsWeekly] = useState(true); // State to track whether we're viewing weekly or monthly data

  // Switch between weekly and monthly data
  const handleToggle = (type) => {
    setIsWeekly(type === "weekly"); // Toggle between true (weekly) and false (monthly)
  };

  // Select the correct pie data (weekly or monthly)
  const selectedData = isWeekly ? weeklyPieData : monthlyPieData;

  // Prepare testData for Pie Chart, ensuring datasets is available
  const testData = {
    labels: selectedData.labels || [], // Use the labels from the selected data (weekly or monthly)
    datasets:
      selectedData.datasets?.map((dataset, index) => ({
        label: dataset.label, // Use the label for each dataset (parent title)
        data: dataset.data, // Use the data for each dataset (task completion data)
        backgroundColor: dataset.borderColor,
        borderColor: dataset.borderColor,
        fill: true, // Fill the area under the line with the background color
        tension: 0.1, // Adjust the line smoothness
        pointRadius: 4, // Set the size of the points on the graph
        pointHoverRadius: 8, // Set the size of the points when hovered over
      })) || [],
  };

  return (
    <div className="bg-[#777777] text-black flex flex-col justify-between items-center w-full h-full md:h-full p-[10px]">
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

      {/* Pie Chart and Legend Container */}
      <div className="flex w-full bg-[#b3b3b3]">
        {/* Pie Chart */}
        <div className="h-auto w-auto">
          <Pie data={testData} />
        </div>

        {/* Legend */}
        <div className="flex flex-col w-full ml-2 bg-[#d9d9d9] p-1 m-2">
          {/* Dynamic Legend Title */}
          <h3 className="text-lg font-semibold mb-4">
            {isWeekly
              ? "Legend: Worked Directory Spread - Last 7 Days"
              : "Legend: Worked Directory Spread - Last 30 Days"}
          </h3>

          {selectedData.labels?.map((label, index) => (
            <div key={index} className="flex items-center mb-2">
              {/* Square Color Indicator */}
              <div
                className="h-4 w-4 mr-1"
                style={{
                  backgroundColor:
                    selectedData.datasets?.[0]?.borderColor?.[index],
                }}
              ></div>
              <span className="ml-2">
                {label}: {selectedData.datasets?.[0]?.data?.[index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
