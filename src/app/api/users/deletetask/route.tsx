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
    console.log("taskFound", taskFound);

    if (!taskFound) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Remove the task from the project's tasks array
    project.tasks.pull({ _id: taskId });

    // Save the updated project
    await project.save();

    return NextResponse.json({
      message: "Task Deleted Successfully!",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Delete Task API Failed" },
      { status: 500 },
    );
  }
}
