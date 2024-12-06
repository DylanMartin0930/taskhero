"use client";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useGraphContext } from "../context/GraphContext";

ChartJS.register(Tooltip, Legend, ArcElement);

export default function PieChart({ token, filter, showToggle = true }) {
	const [currentToken, setCurrentToken] = useState("");

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const urlToken = urlParams.get("token");
		console.log("URL Token: ", urlToken);
		setCurrentToken(urlToken || ""); // Set an empty string if token is missing
	}, []);

	useEffect(() => {
		if (currentToken != token) {
			refreshPieData(token, filter);
		}
	}, [currentToken, filter]);

	// Use the GraphContext to get data
	const {
		refreshPieData,
		haveWeeklyPieData,
		haveMonthlyPieData,
		weeklyPieData,
		monthlyPieData,
	} = useGraphContext();

	useEffect(() => {
		if (token && (!haveWeeklyPieData || !haveMonthlyPieData)) {
			console.log("Refreshing pie data...");
			refreshPieData(token, filter);
		}
	}, [filter, token, !haveWeeklyPieData, !haveMonthlyPieData, refreshPieData]);

	const [isWeekly, setIsWeekly] = useState(true);

	const handleToggle = (type) => {
		setIsWeekly(type === "weekly");
	};

	const selectedData = isWeekly ? weeklyPieData : monthlyPieData;

	const isDataEmpty =
		(isWeekly && (!weeklyPieData || weeklyPieData.labels?.length === 0)) ||
		(!isWeekly && (!monthlyPieData || monthlyPieData.labels?.length === 0));

	const testData = {
		labels: selectedData.labels || [],
		datasets:
			selectedData.datasets?.map((dataset, index) => ({
				label: dataset.label,
				data: dataset.data,
				backgroundColor: dataset.borderColor,
				borderColor: dataset.borderColor,
				fill: false,
				tension: 0.1,
				pointRadius: 4,
				pointHoverRadius: 8,
			})) || [],
	};

	return (
		<div className="bg-[#777777] text-black flex flex-col justify-between items-center w-full h-full md:h-full p-[10px]">
			{/* Toggle Button - Only show if showToggle prop is true */}
			{showToggle && !isDataEmpty && (
				<div>
					<button
						onClick={() => handleToggle("weekly")}
						className={`border-black p-1 mb-2 ${
							isWeekly
								? "bg-[#b3b3b3] text-black border border-black"
								: "bg-[#d9d9d9] text-black"
						}`}
					>
						Weekly
					</button>

					<button
						onClick={() => handleToggle("monthly")}
						className={`p-1 mb-2 ${
							isWeekly
								? "bg-[#d9d9d9] text-black"
								: "bg-[#b3b3b3] text-black border border-black"
						}`}
					>
						Monthly
					</button>
				</div>
			)}

			{/* Pie Chart and Legend Container */}
			{isDataEmpty ? (
				<div className="text-center text-white text-lg mt-4">
					Assign tasks to today to get info!
				</div>
			) : (
				<div className="flex w-full bg-[#b3b3b3]">
					<div className="h-auto w-auto">
						<Pie data={testData} />
					</div>

					<div className="flex flex-col w-full ml-2 bg-[#d9d9d9] p-1 m-2">
						<h3 className="text-lg font-semibold mb-4">
							{isWeekly
								? "Legend: Worked Directory Spread - Last 7 Days"
								: "Legend: Worked Directory Spread - Last 30 Days"}
						</h3>

						{selectedData.labels?.map((label, index) => (
							<div key={index} className="flex items-center mb-2">
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
			)}
		</div>
	);
}
