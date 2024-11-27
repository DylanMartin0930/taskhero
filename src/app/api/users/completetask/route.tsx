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
    const { token, taskId } = await request.json();

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

    // Find the project using the decrypted projectId and the user ID
    const project = await Project.findOne({
      _id: projectId,
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

    // Update the task's Complete status to true and set completeDate to the current date
    taskFound.completestatus = true;
    taskFound.completeDate = new Date();

    // Save the updated project
    await project.save();

    // Find the "logbook" project
    const logbookProject = await Project.findOne({
      title: "logbook", // Searching for the project named "logbook"
      userId: user._id, // Ensure that the logbook belongs to the correct user
    });

    if (!logbookProject) {
      return NextResponse.json(
        { error: "Logbook project not found" },
        { status: 404 },
      );
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
