"use Client";
// src/components/GraphWrapper.js
import React, { useEffect } from "react";
import { useGraphContext } from "../context/GraphContext";
import LineGraph from "./linegraph";

export default function GraphWrapper({ token }) {
  const {
    weeklyData,
    monthlyData,
    haveWeeklyData,
    haveMonthlyData,
    refreshRegularData,
  } = useGraphContext();

  // Fetch the data only once when the token is obtained
  useEffect(() => {
    if (token && !haveWeeklyData && !haveMonthlyData) {
      refreshRegularData(token); // Trigger the API call only when token is available
    }
  }, [token, haveWeeklyData, haveMonthlyData, refreshRegularData]);

  // Wait for both data sets to be available before rendering
  const hasAllData = haveWeeklyData && haveMonthlyData;

  return (
    <div
      className={`w-full overflow-hidden transition-all duration-500 ease-out ${
        hasAllData ? "h-auto opacity-100" : "h-0 opacity-0"
      }`}
    >
      {hasAllData ? (
        <LineGraph
          weeklyData={weeklyData}
          monthlyData={monthlyData}
          haveData={hasAllData}
        />
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
