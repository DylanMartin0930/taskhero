import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Project from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Cryptr from "cryptr";

connect();

export async function POST(request: NextRequest) {
  try {
    // Extract the project ID from the request body
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Please provide a project ID" },
        { status: 400 },
      );
    }

    // Initialize the Cryptr instance
    const cryptr = new Cryptr(process.env.TOKEN_SECRET);
    const decryptedId = cryptr.decrypt(projectId);

    // Get user ID from the token in the request
    const userID = getDataFromToken(request);

    // Find the user in the database
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the project using the decrypted ID and the user ID
    const project = await Project.findOne({
      _id: decryptedId,
      userId: userID,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if the project has tasks
    if (!project.tasks || project.tasks.length === 0) {
      return NextResponse.json({
        message: "No tasks found",
        data: [],
      });
    }

    // Filter tasks where completeStatus is false
    const incompleteTasks = project.tasks.filter(
      (task) => task.completestatus === false,
    );

    // Return only the incomplete tasks
    return NextResponse.json({
      message: "Incomplete Tasks Found",
      data: incompleteTasks,
    });
  } catch (error) {
    return NextResponse.json({ error: "getTask API Failed" }, { status: 500 });
  }
}
