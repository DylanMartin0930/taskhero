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

    // Find all projects owned by the user
    const projects = await Project.find({
      userId: userID,
    });

    if (!projects || projects.length === 0) {
      return NextResponse.json({ error: "No projects found" }, { status: 404 });
    }

    // Gather tasks with `completestatus: true` from all projects
    const completedTasks = [];
    for (const project of projects) {
      const tasksCompleted = project.tasks.filter(
        (task) => task.completestatus === true,
      );
      completedTasks.push(...tasksCompleted);
    }

    console.log("Completed tasks:", completedTasks);

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
