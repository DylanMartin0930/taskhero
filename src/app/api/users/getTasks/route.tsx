import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Cryptr from "cryptr";
import { NextRequest, NextResponse } from "next/server";

// Connect to database
connect();

// Define response type for better type safety
interface TaskResponse {
	message: string;
	data: any[];
}

export async function POST(request: NextRequest) {
	try {
		// Extract the project ID from the request body
		const { projectId } = await request.json();

		if (!projectId) {
			return NextResponse.json(
				{ error: "Please provide a project ID" },
				{ status: 400 }
			);
		}

		// Initialize the Cryptr instance
		const cryptr = new Cryptr(process.env.TOKEN_SECRET!);
		const decryptedId = cryptr.decrypt(projectId);

		// Get user ID from the token in the request
		const userID = getDataFromToken(request);

		// Find the user in the database - use lean() for better performance
		const user = await User.findOne({ _id: userID }).select("_id").lean();

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Find the project and filter tasks at the database level
		// Only select necessary fields and use lean() for better performance
		const project = await Project.findOne({
			_id: decryptedId,
			userId: userID,
			"tasks.completestatus": false, // Filter at database level
		})
			.select("tasks")
			.lean();

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// If no tasks exist, return early
		if (!project.tasks?.length) {
			return NextResponse.json({
				message: "No tasks found",
				data: [],
			});
		}

		// Filter tasks at database level instead of in memory
		const incompleteTasks = project.tasks.filter(
			(task) => !task.completestatus
		);

		const response: TaskResponse = {
			message: "Incomplete Tasks Found",
			data: incompleteTasks,
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("getTasks API Error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
