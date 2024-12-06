import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

// Connect to database once when module is loaded
connect();

// Cache the date formatting function
const formatDueDate = (() => {
	const pad = (num: number) => String(num).padStart(2, "0");

	return (dueDate: string | Date) => {
		const date = new Date(dueDate);
		return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
			date.getUTCDate()
		)} 12:00`;
	};
})();

export async function GET(request: NextRequest) {
	try {
		const userID = getDataFromToken(request);

		// Use lean() for better performance when we only need to read data
		const user = await User.findOne({ _id: userID }).select("-password").lean();

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Optimize query by:
		// 1. Only selecting needed fields
		// 2. Using lean() for better performance
		// 3. Adding specific conditions to filter at database level
		const projects = await Project.find({
			userId: userID,
			Completestatus: false,
			title: { $ne: "today" },
			"tasks.completestatus": false, // Only get projects with incomplete tasks
		})
			.select("_id title tasks")
			.lean();

		if (!projects?.length) {
			return NextResponse.json({ error: "No projects found" }, { status: 404 });
		}

		// Process projects in parallel for better performance
		const projectsWithTasks = await Promise.all(
			projects.map(async (project) => {
				const incompleteTasks = project.tasks
					?.filter((task) => !task.completestatus)
					?.map((task) => ({
						id: task._id,
						title: task.title,
						start: formatDueDate(task.dueDate),
						end: formatDueDate(task.dueDate),
					}));

				if (!incompleteTasks?.length) return null;

				return {
					projectId: project._id,
					projectTitle: project.title,
					taskCount: incompleteTasks.length,
					tasks: incompleteTasks,
				};
			})
		);

		// Filter out null values
		const validProjects = projectsWithTasks.filter(Boolean);

		return NextResponse.json({
			message: "Events retrieved successfully",
			data: validProjects,
		});
	} catch (error) {
		console.error("Calendar events error:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}
