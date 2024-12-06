import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Project from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Cryptr from "cryptr";

connect();

// /api/users/login/route.tsx
export async function POST(request: NextRequest) {
  try {
    // Extract taskID and token from request body
    const { token, task } = await request.json();

    // Decrypt the project ID from the token
    const cryptr = new Cryptr(process.env.TOKEN_SECRET);
    const projectId = cryptr.decrypt(token);

    // Get the user ID from the token
    const userID = getDataFromToken(request);

    // Find the user from the database
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if streak-related fields exist on the user, if not initialize them
    if (!user.currentStreak) user.currentStreak = 1;
    if (!user.longestStreak) user.longestStreak = 0;
    if (!user.completedTasks) user.completedTasks = 0;
    if (!user.lastTaskCompleted)
      user.lastTaskCompleted = new Date().setHours(0, 0, 0, 0);

    // Find the project using the decrypted projectId and the user ID
    const project = await Project.findOne({
      _id: projectId,
      userId: user._id,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 401 });
    }

    // Search for the task within the project's task subdocuments
    const taskFound = project.tasks.find((t) => t._id.toString() === task._id);

    if (!taskFound) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update the task's Complete status to true and set completeDate to the current date
    taskFound.completestatus = true;
    taskFound.completeDate = new Date();

    // Save the updated project
    await project.save();

    // Increment user.completedTasks
    user.completedTasks += 1;

    // Get the current date with time set to 00:00:00.000
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to midnight (00:00:00.000)

    // Check if the user has completed tasks on the same day
    const lastTaskDate = user.lastTaskCompleted
      ? new Date(user.lastTaskCompleted)
      : null;

    if (lastTaskDate) {
      lastTaskDate.setHours(0, 0, 0, 0); // Ensure it's at midnight too
    }

    if (!lastTaskDate || currentDate.getTime() === lastTaskDate.getTime()) {
      // If the dates are the same, don't update lastTaskCompleted or increment currentStreak,
      // just check if currentStreak is greater than longestStreak and update if necessary
      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }
    } else {
      const dayDifference =
        (currentDate.getTime() - lastTaskDate.getTime()) / (1000 * 3600 * 24);

      if (dayDifference === 1) {
        // If current date is 1 day after lastTaskCompleted, increment currentStreak
        user.currentStreak += 1;
        user.lastTaskCompleted = currentDate;
      } else if (dayDifference > 1) {
        // If the dates are more than 1 day apart, reset currentStreak to 1
        if (user.currentStreak > user.longestStreak) {
          user.longestStreak = user.currentStreak;
        }
        user.currentStreak = 1;
        user.lastTaskCompleted = currentDate;
      }
    }

    // If the current streak is greater than the longest streak, update longest streak
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }

    // Save the user document with the updated streaks and task count
    await user.save();
    console.log("Current Streak: ", user.currentStreak);
    console.log("Longest Streak: ", user.longestStreak);

    // Find the "logbook" project
    let logbookProject = await Project.findOne({
      title: "logbook", // Searching for the project named "logbook"
      userId: user._id, // Ensure that the logbook belongs to the correct user
    });

    // If logbook project doesn't exist, create one
    if (!logbookProject) {
      logbookProject = new Project({
        title: "logbook",
        userId: user._id,
        tasks: [],
      });
      await logbookProject.save();
    }

    // Create a copy of the completed task to push into the logbook's task array
    const completedTaskCopy = { ...taskFound.toObject() }; // Maintain the original _id

    // Push the task into the logbook's task array
    logbookProject.tasks.push(completedTaskCopy);

    // Save the updated logbook project
    await logbookProject.save();

    return NextResponse.json({
      message: "Task completed and added to Logbook!",
      success: true,
    });
  } catch (error: any) {
    console.error(error); // Log the error for debugging purposes
    return NextResponse.json(
      { error: "Task completion failed" },
      { status: 500 },
    );
  }
}
