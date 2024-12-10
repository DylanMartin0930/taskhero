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

	useEffect(() => {
		if (token && (!haveWeeklyData || !haveMonthlyData)) {
			refreshRegularData(token);
		}
	}, [token, refreshRegularData, haveWeeklyData, haveMonthlyData]);

	const hasAllData = haveWeeklyData && haveMonthlyData;

	return (
		<div className="w-full h-full min-h-[200px] max-h-[400px] overflow-hidden transition-all duration-500 ease-out">
			{hasAllData ? (
				<div className="w-full h-full">
					<LineGraph
						weeklyData={weeklyData}
						monthlyData={monthlyData}
						haveData={hasAllData}
					/>
				</div>
			) : (
				<div className="w-full h-full flex items-center justify-center bg-[#d9d9d9] border border-black">
					<p>Loading...</p>
				</div>
			)}
		</div>
	);
}
