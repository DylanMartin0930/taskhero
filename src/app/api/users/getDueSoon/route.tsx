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

		const user = await User.findOne({ _id: userID }).select("_id").lean();

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Get current date and 7 days from now, normalized to midnight
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const nextWeek = new Date(today);
		nextWeek.setDate(today.getDate() + 7);
		nextWeek.setHours(0, 0, 0, 0);

		// Changed from findOne to find to get all matching projects
		const project = await Project.findOne({
			_id: decryptedId,
			userId: userID,
		})
			.select("tasks")
			.lean();

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// Filter tasks in memory with all conditions
		const upcomingTasks = project.tasks.filter((task) => {
			const taskDueDate = new Date(task.dueDate);
			taskDueDate.setHours(0, 0, 0, 0);

			return (
				!task.completestatus &&
				task.dueDate && // Ensure dueDate exists
				taskDueDate >= today &&
				taskDueDate <= nextWeek
			);
		});
		console.log(upcomingTasks);

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
