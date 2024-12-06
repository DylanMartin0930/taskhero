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

    // Find the specific project by projectId and userId
    const project = await Project.findOne({
      _id: decryptedId,
      userId: userID,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Separate tasks based on `completeStatus`
    const incompleteTasks = project.tasks.filter(
      (task) => !task.completestatus,
    );
    const completedTasks = project.tasks.filter((task) => task.completestatus);

    // Remove completed tasks from the project
    if (completedTasks.length > 0) {
      project.tasks = incompleteTasks;
      await project.save();
    }

    return NextResponse.json({
      message: "Filtered incomplete tasks and removed completed tasks",
      data: incompleteTasks, // Return only incomplete tasks
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to filter tasks" },
      { status: 500 },
    );
  }
}
