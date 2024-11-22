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

    // Get the current date (normalize to midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all projects owned by the user except "logbook", "trash", and "upcoming"
    const projects = await Project.find({
      userId: userID,
      title: { $nin: ["logbook", "trash", "upcoming"] }, // Exclude specified titles
    });

    if (!projects || projects.length === 0) {
      return NextResponse.json({ error: "No projects found" }, { status: 404 });
    }

    // Gather tasks with today's assigned date from all projects
    const todaysTasks = [];
    for (const project of projects) {
      const tasksForToday = project.tasks.filter((task) => {
        const taskAssignedDate = new Date(task.assignedDate);
        taskAssignedDate.setHours(0, 0, 0, 0); // Normalize to midnight
        return taskAssignedDate.getTime() === today.getTime();
      });
      todaysTasks.push(...tasksForToday);
    }

    console.log("todays tasks:", todaysTasks);

    return NextResponse.json({
      message: "Today's tasks retrieved successfully",
      data: todaysTasks,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve tasks" },
      { status: 500 },
    );
  }
}
