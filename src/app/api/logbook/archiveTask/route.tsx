import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Cryptr from "cryptr";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
	try {
		// Extract the task and currentProjectId from the request body
		const { task, currentProjectId } = await request.json();

		if (!task || !currentProjectId) {
			return NextResponse.json(
				{ error: "Please provide both task details and project ID" },
				{ status: 400 }
			);
		}

		// Initialize the Cryptr instance to decrypt projectId
		const cryptr = new Cryptr(process.env.TOKEN_SECRET);
		const decryptedProjectId = cryptr.decrypt(currentProjectId);

		// Get user ID from the token in the request
		const userID = getDataFromToken(request);

		// Find the user in the database
		const user = await User.findOne({ _id: userID }).select("-password");

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Find the current project using the decrypted ID and the user ID
		const currentProject = await Project.findOne({
			_id: decryptedProjectId,
			userId: userID,
		});

		if (!currentProject) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// Search for the task in the current project
		const taskIndex = currentProject.tasks.findIndex(
			(t) => t._id.toString() === task._id
		);

		if (taskIndex === -1) {
			return NextResponse.json(
				{ error: "Task not found in current project" },
				{ status: 404 }
			);
		}

		// Delete the task from the current project
		currentProject.tasks.splice(taskIndex, 1);

		// Check if the task has a parent project
		if (task.parent) {
			// Find the parent project using the task's parent ID
			const parentProject = await Project.findOne({
				_id: task.parent,
				userId: userID,
			});

			if (!parentProject) {
				return NextResponse.json(
					{ error: "Parent project not found" },
					{ status: 404 }
				);
			}

			// Find the task in the parent project
			const parentTaskIndex = parentProject.tasks.findIndex(
				(t) => t._id.toString() === task._id
			);

			if (parentTaskIndex === -1) {
				await currentProject.save();
				return NextResponse.json({
					message: "Task Archived Successfully",
					success: true,
				});
			}

			// Delete the task from the parent project
			parentProject.tasks.splice(parentTaskIndex, 1);

			// Save the updated parent project
			await parentProject.save();
		}

		// Save the updated current project
		await currentProject.save();

		return NextResponse.json({
			message: "Task Archived Successfully",
			success: true,
		});
	} catch (error: any) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to delete task" },
			{ status: 500 }
		);
	}
}
