import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Project from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";
import Cryptr from "cryptr";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    // Decrypt the project token
    const cryptr = new Cryptr(process.env.TOKEN_SECRET); // Replace with your secret key
    const decryptedToken = cryptr.decrypt(token);

    const userID = getDataFromToken(request);
    // Fetch user and validate existence
    const user = await User.findOne({ _id: userID }).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the project using the decrypted token and user ID
    const project = await Project.findOne({
      _id: decryptedToken,
      userId: userID,
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Calculate the date range for the last 7 days
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 6); // Include today, so 6 days back

    // Filter tasks completed within the last 7 days
    const completedTasks = project.tasks.filter((task) => {
      const completedDate = new Date(task.completeDate); // Ensure `completedAt` is in your schema
      return (
        task.completestatus &&
        completedDate >= sevenDaysAgo &&
        completedDate <= currentDate
      );
    });
    console.log("Completed tasks:", completedTasks);

    // Prepare data for response
    const labels = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(sevenDaysAgo.getDate() + i);
      return date.toLocaleDateString("en-US", { weekday: "long" }); // Day of the week
    });

    const data = new Array(7).fill(0);
    completedTasks.forEach((task) => {
      const completedDate = new Date(task.completeDate);

      // Normalize completedDate and sevenDaysAgo to midnight
      const normalizedCompletedDate = new Date(
        completedDate.getUTCFullYear(),
        completedDate.getUTCMonth(),
        completedDate.getUTCDate(),
      );
      const normalizedSevenDaysAgo = new Date(
        sevenDaysAgo.getUTCFullYear(),
        sevenDaysAgo.getUTCMonth(),
        sevenDaysAgo.getUTCDate(),
      );

      const dayIndex = Math.floor(
        (normalizedCompletedDate - normalizedSevenDaysAgo) /
          (1000 * 60 * 60 * 24),
      );

      if (dayIndex >= 0 && dayIndex < 7) {
        data[dayIndex]++;
      }
    });
    console.log("Labels:", labels);
    console.log("Data:", data);

    return NextResponse.json({
      labels: labels,
      datasets: [
        {
          label: project.title,
          data: data,
        },
      ],
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "API failed" }, { status: 500 });
  }
}
