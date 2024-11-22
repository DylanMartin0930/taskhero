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
    //extract taskID from request body
    const { token, taskId } = await request.json();

    //get project ID from token
    const cryptr = new Cryptr(process.env.TOKEN_SECRET);
    const projectId = cryptr.decrypt(token);

    //get user from database
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    // Find the project using the decrypted ID and the user ID
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

    // Update the task's Complete status to true and set completeDate to current date
    taskFound.completestatus = true;
    taskFound.completeDate = new Date();

    // Save the updated project
    await project.save();

    return NextResponse.json({
      message: "Tasks Completed!",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "getTask API Failed" }, { status: 500 });
  }
}
