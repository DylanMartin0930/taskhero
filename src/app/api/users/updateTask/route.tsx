import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

// /api/tasks/updateTask/route.tsx
export async function POST(request: NextRequest) {
	try {
		// Extract projectId, taskId, and editedTask from the request body
		const { task, editedTask } = await request.json();

		// Decrypt the project ID

		// Get user from token
		const userID = getDataFromToken(request);
		const user = await User.findOne({ _id: userID }).select("-password");

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Find the project by decrypted ID and user ID
		const project = await Project.findOne({
			_id: task.parent,
			userId: user._id,
		});

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// Find the task within the project's tasks array
		const updatedTask = project.tasks.find(
			(t) => t._id.toString() === task._id
		);

		if (!task) {
			return NextResponse.json({ error: "Task not found" }, { status: 404 });
		}

		// Update task with values from editedTask
		updatedTask.title = editedTask.title || task.title;
		updatedTask.description = editedTask.description || task.description;
		updatedTask.folder = editedTask.folder || task.folder;
		updatedTask.dueDate = editedTask.dueDate || task.dueDate;
		updatedTask.assignedDate = editedTask.assignedDate || task.assignedDate;

		// Save the updated project
		await project.save();

		return NextResponse.json({
			message: "Task Updated Successfully!",
			success: true,
		});
	} catch (error: any) {
		console.error(error);
		return NextResponse.json(
			{ error: "Update Task API Failed" },
			{ status: 500 }
		);
	}
}
