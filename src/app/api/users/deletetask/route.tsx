import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Cryptr from "cryptr";
import { NextRequest, NextResponse } from "next/server";

connect();

// /api/users/login/route.tsx
export async function POST(request: NextRequest) {
	try {
		// Extract taskID and token from request body
		const { projectId, taskId } = await request.json();

		// Get project ID from token
		const cryptr = new Cryptr(process.env.TOKEN_SECRET);
		const decryptedId = cryptr.decrypt(projectId);

		// Get user from database
		const userID = getDataFromToken(request);
		const user = await User.findOne({ _id: userID }).select("-password");

		// Find the project using the decrypted ID and the user ID
		const project = await Project.findOne({
			_id: decryptedId,
			userId: user._id,
		});

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// Search for the task within the project's task subdocuments
		const taskFound = project.tasks.find((t) => t._id.toString() === taskId);

		if (!taskFound) {
			return NextResponse.json({ error: "Task not found" }, { status: 404 });
		}

		// Find the trash project
		const trashProject = await Project.findOne({
			title: "trash",
			userId: user._id,
		});

		if (!trashProject) {
			return NextResponse.json(
				{ error: "Trash project not found" },
				{ status: 404 }
			);
		}

		// Create a copy of the task for the trash
		const taskCopy = {
			...taskFound.toObject(),
			parent: project._id, // Store original project as parent
			deletedDate: new Date(),
		};

		// Add the task copy to trash project
		trashProject.tasks.push(taskCopy);
		await trashProject.save();

		// Remove the task from the original project's tasks array
		project.tasks.pull({ _id: taskId });

		// Save the updated project
		await project.save();

		return NextResponse.json({
			message: "Task Moved to Trash Successfully!",
			success: true,
		});
	} catch (error: any) {
		return NextResponse.json(
			{ error: "Delete Task API Failed" },
			{ status: 500 }
		);
	}
}
