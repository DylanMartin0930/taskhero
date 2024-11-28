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

    // Calculate the date range for the last 30 days
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 29); // Include today, so 29 days back

    // Filter tasks completed within the last 30 days
    const completedTasks = project.tasks.filter((task) => {
      const completedDate = new Date(task.completeDate);
      return (
        task.completestatus &&
        completedDate >= thirtyDaysAgo &&
        completedDate <= currentDate
      );
    });

    console.log("Completed tasks:", completedTasks);

    // Helper function to format date as "Month Date" with abbreviated month
    const formatDate = (date: Date) => {
      return `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}`;
    };

    // Helper function to get the start of the week (Monday)
    const getStartOfWeek = (date: Date) => {
      const dayOfWeek = date.getDay(); // Sunday = 0, Monday = 1, etc.
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust to start on Monday
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - diff);
      startOfWeek.setHours(0, 0, 0, 0); // Normalize to midnight
      return startOfWeek;
    };

    // Helper function to get the end of the week (Sunday)
    const getEndOfWeek = (date: Date) => {
      const startOfWeek = getStartOfWeek(date);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday of the week
      return endOfWeek;
    };

    // Calculate week intervals (7 days per week), and ensure we include the current week
    const labels = Array.from({ length: 5 }, (_, i) => {
      const startOfWeek = getStartOfWeek(new Date(thirtyDaysAgo));
      startOfWeek.setDate(startOfWeek.getDate() + i * 7); // Move to the correct week
      const endOfWeek = getEndOfWeek(startOfWeek);

      if (i === 4) {
        // For the last (current) week, use today's date for the end
        return `${formatDate(startOfWeek)} - ${formatDate(currentDate)}`;
      }

      return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`; // Format each week as "Month Date - Month Date"
    });

    const data = new Array(5).fill(0); // 5 weeks (4 past weeks + current week)

    completedTasks.forEach((task) => {
      const completedDate = new Date(task.completeDate);
      const dayDifference = Math.floor(
        (completedDate - thirtyDaysAgo) / (1000 * 60 * 60 * 24),
      );
      const weekIndex = Math.floor(dayDifference / 7); // Determine which week the task belongs to

      // Make sure the task belongs to a valid week (0-4 for 5 weeks)
      if (weekIndex >= 0 && weekIndex < 5) {
        data[weekIndex]++;
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
