import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Cryptr from "cryptr";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
	try {
		// Extract task and currentProjectId from the request body
		const { task, currentProjectId } = await request.json();

		if (!task || !currentProjectId) {
			return NextResponse.json(
				{ error: "Please provide both task details and project ID" },
				{ status: 400 }
			);
		}

		// Initialize Cryptr instance to decrypt projectId
		const cryptr = new Cryptr(process.env.TOKEN_SECRET);
		const decryptedProjectId = cryptr.decrypt(currentProjectId);

		// Get user ID from the token in the request
		const userID = getDataFromToken(request);

		// Find the user in the database
		const user = await User.findOne({ _id: userID }).select("-password");

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Check if streak-related fields exist on the user, if not initialize them
		if (!user.currentStreak) user.currentStreak = 0;
		if (!user.longestStreak) user.longestStreak = 0;
		if (!user.completedTasks) user.completedTasks = 0;
		if (!user.lastTaskCompleted) user.lastTaskCompleted = null;

		// Find the current project using the decrypted ID and the user ID
		const currentProject = await Project.findOne({
			_id: decryptedProjectId,
			userId: userID,
		});

		if (!currentProject) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// Find the task in the current project using find() method
		const taskToUpdate = currentProject.tasks.find(
			(t) => t._id.toString() === task._id
		);

		if (!taskToUpdate) {
			return NextResponse.json(
				{ error: "Task not found in current project" },
				{ status: 404 }
			);
		}

		// Undo the task completion by setting the completion status to false and removing completeDate
		taskToUpdate.completestatus = false;
		taskToUpdate.completeDate = null;

		// Mark the tasks as modified so that Mongoose can track the changes
		currentProject.markModified("tasks");

		// Check if the task has a parent project and undo the completion there too
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

			// Find the task in the parent project using find() method
			const parentTaskToUpdate = parentProject.tasks.find(
				(t) => t._id.toString() === task._id
			);

			if (!parentTaskToUpdate) {
				// If task is not found in parent project, add it back
				const taskToAdd = {
					...task,
					completestatus: false,
					completeDate: null,
				};

				// Add the task to the parent project's tasks array
				parentProject.tasks.push(taskToAdd);
			} else {
				// If task exists, just update its completion status
				parentTaskToUpdate.completestatus = false;
				parentTaskToUpdate.completeDate = null;
			}

			// Mark the parent project's tasks as modified
			parentProject.markModified("tasks");

			// Save the updated parent project
			await parentProject.save();
		}

		// Check if the task completion affects the current streak and adjust accordingly
		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0); // Set to midnight (00:00:00.000)

		const lastTaskDate = user.lastTaskCompleted
			? new Date(user.lastTaskCompleted)
			: null;

		if (lastTaskDate) {
			lastTaskDate.setHours(0, 0, 0, 0); // Ensure it's at midnight too
		}

		// If the task was the last one completed today, only decrement if no other tasks are completed today
		if (lastTaskDate && currentDate.getTime() === lastTaskDate.getTime()) {
			// Check if there are other tasks completed today
			const tasksCompletedToday = user.completedTasks; // Assuming `completedTasks` tracks the total tasks completed today

			if (tasksCompletedToday > 1) {
				// Do not decrement streak if there are other completed tasks today
				user.currentStreak = user.currentStreak; // Don't decrement
			} else if (user.currentStreak > 0) {
				// Only decrement streak if it is the first task being undone today
				user.currentStreak -= 1;
			}
		}

		// If the current streak is less than the longest streak, update longestStreak if necessary
		if (user.currentStreak < user.longestStreak) {
			user.longestStreak = user.currentStreak;
		}

		// Decrement completedTasks if task completion is undone
		user.completedTasks -= 1;

		// Save the updated user data
		await user.save();

		// Find the "logbook" project to remove the task

		// Find the task in the logbook and remove it
		const logbookTaskToRemove = currentProject.tasks.find(
			(t) => t._id.toString() === task._id
		);

		if (logbookTaskToRemove) {
			// Remove the task from the logbook project
			currentProject.tasks = currentProject.tasks.filter(
				(t) => t._id.toString() !== task._id
			);
		}

		// Save the updated current project
		await currentProject.save();

		return NextResponse.json({
			message: "Task recovery successful, streak updated!",
			success: true,
		});
	} catch (error: any) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to recover task" },
			{ status: 500 }
		);
	}
}
