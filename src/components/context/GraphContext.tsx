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

  // Function to refresh regular data (weekly and monthly)
  const refreshRegularData = useCallback(
    async (token) => {
      // Fetch weekly data
      await getWeeklyData(token, setWeeklyData, setHaveWeeklyData);

      // Fetch monthly data
      await getMonthlyData(token, setMonthlyData, setHaveMonthlyData);
    },
    [], // Empty dependency array ensures refreshRegularData is stable across renders
  );

  // Function to refresh pie data (weekly and monthly) and accommodate the filter
  const refreshPieData = useCallback(
    async (token, filter) => {
      // Fetch weekly pie data with the filter
      await getWeeklyPieData(
        token,
        filter,
        setWeeklyPieData,
        setHaveWeeklyPieData,
      ); // Pass filter here

      // Fetch monthly pie data with the filter
      await getMonthlyPieData(
        token,
        filter,
        setMonthlyPieData,
        setHaveMonthlyPieData,
      ); // Pass filter here
    },
    [], // Empty dependency array ensures refreshPieData is stable across renders
  );

  // Function to refresh both sets of data (regular and pie data)
  const refreshGraphs = useCallback(
    async (token, filter) => {
      await refreshRegularData(token); // Refresh regular data
      await refreshPieData(token, filter); // Refresh pie data with the filter
    },
    [refreshRegularData, refreshPieData], // Ensure that both functions are stable
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
        refreshRegularData, // Expose the refreshRegularData function
        refreshPieData, // Expose the refreshPieData function
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
