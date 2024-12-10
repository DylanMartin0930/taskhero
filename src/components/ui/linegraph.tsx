"use client";
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export default function LineGraph({ weeklyData, monthlyData, haveData }) {
	const [isWeekly, setIsWeekly] = useState(true); // State to track whether we're viewing weekly or monthly data

	// Switch between weekly and monthly data
	const handleToggle = (type: string) => {
		setIsWeekly(type === "weekly"); // Toggle between true (weekly) and false (monthly)
	};

	// Determine which data to use based on the toggle state
	const currentData = isWeekly ? weeklyData : monthlyData;

	// Build testData to handle multiple datasets
	const testData = {
		labels: currentData.labels, // Use the labels from the selected data (weekly or monthly)
		datasets: currentData.datasets.map((dataset, index) => ({
			label: dataset.label, // Use the label for each dataset (parent title)
			data: dataset.data, // Use the data for each dataset (task completion data)
			backgroundColor: dataset.borderColor,
			borderColor: dataset.borderColor,
			tension: 0.1, // Adjust the line smoothness
			pointRadius: 4, // Set the size of the points on the graph
			pointHoverRadius: 8, // Set the size of the points when hovered over
		})),
	};

	// Update the options to enforce whole numbers on the y-axis and label it as "Task Completed"
	const options = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				title: {
					display: true, // Display the x-axis title
					text: "Day of the Week", // Label for the x-axis
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
					text: "Tasks Completed", // Label for the y-axis
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
			title: {
				display: true,
				text: currentData.graphTitle, // Title on top of the graph
				font: {
					size: 16, // Adjust the font size for the title
					weight: "bold", // Make the title bold
					color: "rgb(0, 0, 0)", // Set title color to black
				},
				padding: {
					top: 10, // Space between title and graph
					bottom: 30, // Space between title and the chart
				},
			},
			legend: {
				position: "bottom", // Position the legend at the bottom
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
