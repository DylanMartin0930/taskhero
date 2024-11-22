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

    // Find the specific project using both userId and decrypted projectId
    const project = await Project.findOne({
      _id: decryptedId,
      userId: userID,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get current date and 7 days from now, normalized to midnight (no time part)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight (no time part)

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7); // 7 days from today
    nextWeek.setHours(0, 0, 0, 0); // Normalize to midnight (no time part)
    console.log("Today:", nextWeek);

    // Gather tasks with `completestatus: false` and `duedate` within 7 days
    const upcomingTasks = project.tasks.filter((task) => {
      return (
        task.completestatus === false && // Only tasks that are not complete
        task.dueDate >= today && // Due within the next 7 days
        task.dueDate <= nextWeek
      );
    });

    console.log("Upcoming tasks:", upcomingTasks);

    return NextResponse.json({
      message: "Upcoming tasks retrieved successfully",
      data: upcomingTasks,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve upcoming tasks" },
      { status: 500 },
    );
  }
}
