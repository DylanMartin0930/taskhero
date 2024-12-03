import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import Project from "@/models/projectModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    console.log(token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 500 });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    const defaultProjects = [
      {
        title: "inbox",
        folder: "Inbox",
        canWrite: true,
        color: "rgba(70, 90, 150, 1)",
      },
      { title: "today", folder: "Today" },
      { title: "upcoming", folder: "Upcoming" },
      { title: "logbook", folder: "Logbook" },
      { title: "trash", folder: "Trash" },
    ];

    // Create a project for each default project
    for (const projectData of defaultProjects) {
      const newProject = new Project({
        title: projectData.title,
        folder: projectData.folder,
        userId: user._id, // Set the user's ID for each project
        canWrite: projectData.canWrite || false, // Set the canWrite value if it exists
        color: projectData.color,
        isDefault: true, // Mark the project as default
        tasks: [], // Initially no tasks in these projects
        createdDate: new Date(),
      });

      await newProject.save();
    }

    await user.save();

    return NextResponse.json({ message: "Email verified", success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
