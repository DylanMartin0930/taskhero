import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Cryptr from "cryptr";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
	try {
		const { token, filter } = await request.json();

		if (
			!token ||
			typeof token !== "string" ||
			!["completed", "assigned"].includes(filter)
		) {
			console.log("Invalid input detected:", { token, filter });
			return NextResponse.json(
				{ error: "Invalid or missing token or filter" },
				{ status: 400 }
			);
		}

		// Decrypt the project token
		const cryptr = new Cryptr(process.env.TOKEN_SECRET!);
		const decryptedToken = cryptr.decrypt(token);

		const userID = getDataFromToken(request);

		// Fetch user and validate existence
		const user = await User.findOne({ _id: userID }).select("-password");
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Fetch the project using the decrypted token and user ID
		const project = await Project.findOne({
			_id: decryptedToken,
			userId: userID,
		});
		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}
		// Get the current date and calculate the date 7 days ago
		const currentDate = new Date();
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(currentDate.getDate() - 7);

		// Track unique `parent` attributes and their occurrence counts
		const parentCounts = {};
		project.tasks.forEach((task) => {
			// Determine the date to check based on the filter
			let shouldCount = false;

			if (filter === "completed" && task.completeDate) {
				// For completed tasks, check if completion date is within range
				const taskDate = new Date(task.completeDate);
				taskDate.setHours(0, 0, 0, 0);
				shouldCount = taskDate >= sevenDaysAgo && taskDate <= currentDate;
			} else if (filter === "assigned" && task.assignedDate) {
				// For assigned tasks, count all tasks that have an assigned date
				shouldCount = true;
			}

			// If task should be counted, increment the parent count
			if (shouldCount && task.parent) {
				parentCounts[task.parent] = (parentCounts[task.parent] || 0) + 1;
			}
		});

		// Prepare labels, data, and background colors
		const labels = [];
		const data = [];
		const parentIds = Object.keys(parentCounts);
		const borderColor = [];

		for (let i = 0; i < parentIds.length; i++) {
			const parentId = parentIds[i];
			const count = parentCounts[parentId];

			// Fetch the title and color of the parent project
			const parentProject = await Project.findOne({
				_id: parentId,
				userId: userID,
			});

			if (parentProject) {
				labels.push(parentProject.title);
				data.push(count);

				const parentColor = parentProject.color || "rgba(0, 0, 0, 1)"; // Default color if no color exists
				borderColor.push(parentColor); // Set borderColor to parent's color
			}
		}

		return NextResponse.json({
			labels,
			datasets: [
				{
					label: "Directories",
					data,
					borderColor,
				},
			],
		});
	} catch (error) {
		console.error("API error:", error);
		return NextResponse.json({ error: "API failed" }, { status: 500 });
	}
}
