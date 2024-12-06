import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Cryptr from "cryptr";
import { NextRequest, NextResponse } from "next/server";

// Connect to database once
connect();

// Cache the Cryptr instance
const cryptr = new Cryptr(process.env.TOKEN_SECRET!);

export async function POST(request: NextRequest) {
	try {
		const { projectId } = await request.json();
		const decryptedId = cryptr.decrypt(projectId);
		const userID = getDataFromToken(request);

		// Use lean() for better performance when we only need to read data
		const user = await User.findOne({ _id: userID })
			.select("_id") // Only select the _id field since we just need to verify existence
			.lean();

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Get current date and 7 days from now, normalized to midnight
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const nextWeek = new Date(today);
		nextWeek.setDate(today.getDate() + 7);
		nextWeek.setHours(0, 0, 0, 0);

		// Optimize query by:
		// 1. Only selecting tasks field
		// 2. Using lean() for better performance
		// 3. Adding specific conditions to filter at database level
		const project = await Project.findOne({
			_id: decryptedId,
			userId: userID,
			"tasks.completestatus": false, // Only get projects with incomplete tasks
			"tasks.dueDate": {
				$gte: today,
				$lte: nextWeek,
			},
		})
			.select("tasks")
			.lean();

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// Filter tasks at database level instead of in memory
		const upcomingTasks = project.tasks.filter(
			(task) =>
				!task.completestatus &&
				task.dueDate >= today &&
				task.dueDate <= nextWeek
		);

		return NextResponse.json({
			message: "Upcoming tasks retrieved successfully",
			data: upcomingTasks,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to retrieve upcoming tasks" },
			{ status: 500 }
		);
	}
}
