// src/context/GraphContext.js
import React, { createContext, useState, useContext, useCallback } from "react";
import { getWeeklyData } from "../queries/getWeeklyData";
import { getMonthlyData } from "../queries/getMonthlyData";
import { getWeeklyPieData } from "../queries/getWeeklyPieData"; // Add this import
import { getMonthlyPieData } from "../queries/getMonthlyPieData"; // Add this import

// Create context
const GraphContext = createContext();

// GraphProvider component to wrap around the app
export const GraphProvider = ({ children }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyPieData, setWeeklyPieData] = useState([]); // New state for weekly pie data
  const [monthlyPieData, setMonthlyPieData] = useState([]); // New state for monthly pie data
  const [haveWeeklyData, setHaveWeeklyData] = useState(false);
  const [haveMonthlyData, setHaveMonthlyData] = useState(false);
  const [haveWeeklyPieData, setHaveWeeklyPieData] = useState(false); // New state for checking if weekly pie data is fetched
  const [haveMonthlyPieData, setHaveMonthlyPieData] = useState(false); // New state for checking if monthly pie data is fetched

  const refreshGraphs = useCallback(
    async (token) => {
      // Fetch weekly data
      await getWeeklyData(token, setWeeklyData, setHaveWeeklyData);

      // Fetch monthly data
      await getMonthlyData(token, setMonthlyData, setHaveMonthlyData);

      // Fetch weekly pie data
      await getWeeklyPieData(token, setWeeklyPieData, setHaveWeeklyPieData); // New function call

      // Fetch monthly pie data
      await getMonthlyPieData(token, setMonthlyPieData, setHaveMonthlyPieData); // New function call
    },
    [], // Empty dependency array ensures refreshGraphs is stable across renders
  );

  return (
    <GraphContext.Provider
      value={{
        weeklyData,
        monthlyData,
        weeklyPieData, // Include weekly pie data in context
        monthlyPieData, // Include monthly pie data in context
        haveWeeklyData,
        haveMonthlyData,
        haveWeeklyPieData, // Include state for checking weekly pie data
        haveMonthlyPieData, // Include state for checking monthly pie data
        refreshGraphs,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

// Custom hook to use GraphContext
export const useGraphContext = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error("useGraphContext must be used within a GraphProvider");
  }
  return context;
};
