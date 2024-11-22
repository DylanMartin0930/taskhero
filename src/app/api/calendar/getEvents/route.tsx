import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Project from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find all projects for the user where Completestatus is false
    const projects = await Project.find({
      userId: userID,
      Completestatus: false,
    });

    if (!projects || projects.length === 0) {
      return NextResponse.json({ error: "No projects found" }, { status: 404 });
    }

    // Gather tasks with Completestatus: false from each project
    const tasks = [];
    projects.forEach((project) => {
      if (project.tasks && Array.isArray(project.tasks)) {
        project.tasks.forEach((task) => {
          if (!task.completestatus) {
            // Format due date to "year-month-day time" with time set to midnight
            const dueDate = new Date(task.dueDate);
            const formattedDueDate = `${dueDate.getUTCFullYear()}-${String(
              dueDate.getUTCMonth() + 1,
            ).padStart(2, "0")}-${String(dueDate.getUTCDate()).padStart(
              2,
              "0",
            )} 12:00`;

            tasks.push({
              id: "1",
              title: task.title,
              start: formattedDueDate,
              end: formattedDueDate,
            });
          }
        });
      }
    });
    console.log("TASKS!!!", tasks);

    return NextResponse.json({
      message: "Tasks Found",
      data: tasks,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "getTask API Failed" }, { status: 500 });
  }
}
