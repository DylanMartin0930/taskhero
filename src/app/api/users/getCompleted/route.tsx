import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Project from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Cryptr from "cryptr";

connect();

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json();

    const cryptr = new Cryptr(process.env.TOKEN_SECRET);
    const decryptedId = cryptr.decrypt(projectId);

    // Get user ID from the token in the request
    const userID = getDataFromToken(request);

    // Find the user in the database
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the specific project using the decrypted project ID
    const project = await Project.findOne({
      _id: decryptedId,
      userId: user._id, // Ensure the project belongs to the user
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Return all tasks, assuming they are already completed
    const completedTasks = project.tasks; // All tasks are considered completed

    return NextResponse.json({
      message: "Completed tasks retrieved successfully",
      data: completedTasks,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve completed tasks" },
      { status: 500 },
    );
  }
}
