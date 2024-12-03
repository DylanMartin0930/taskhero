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
    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(currentDate.getDate() - 29); // 29 days ago (30-day range)

    // Normalize both currentDate and thirtyDaysAgo to midnight to avoid timezone issues
    currentDate.setHours(0, 0, 0, 0);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // Helper function to format dates as "mm/dd/yy"
    const formatDate = (date) => {
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure two-digit month
      const day = date.getDate().toString().padStart(2, "0"); // Ensure two-digit day
      const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
      return `${month}/${day}/${year}`;
    };

    // Calculate weekly intervals within the 30-day range
    const weeks = [];
    let startOfWeek = new Date(thirtyDaysAgo);
    while (startOfWeek <= currentDate) {
      let endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // 7 days in each week

      // Adjust if the week goes beyond the current date
      if (endOfWeek > currentDate) {
        endOfWeek = new Date(currentDate);
      }

      weeks.push({
        start: new Date(startOfWeek),
        end: new Date(endOfWeek),
      });

      startOfWeek.setDate(startOfWeek.getDate() + 7); // Move to the next week
    }

    // Generate graph title reflecting the 30-day range
    const graphTitle = `Last 30 Days: ${formatDate(thirtyDaysAgo)} - ${formatDate(currentDate)}`;

    // Filter tasks completed within the last 30 days
    const completedTasks = project.tasks.filter((task) => {
      const completedDate = new Date(task.completeDate); // Ensure `completeDate` is in your schema
      completedDate.setHours(0, 0, 0, 0); // Normalize to midnight
      return (
        task.completestatus &&
        completedDate >= thirtyDaysAgo &&
        completedDate <= currentDate
      );
    });

    // Track tasks by their parent attribute
    const parentTasks = {};

    completedTasks.forEach((task) => {
      if (task.parent) {
        if (!parentTasks[task.parent]) {
          parentTasks[task.parent] = [];
        }
        parentTasks[task.parent].push(task);
      }
    });

    // Prepare the datasets by iterating over each parent task group
    const datasets = [];
    for (const [parentId, tasks] of Object.entries(parentTasks)) {
      // Fetch the parent project (title and color)
      const parentProject = await Project.findOne({
        _id: parentId,
        userId: userID,
      });

      if (parentProject) {
        const parentTitle = parentProject.title;
        const parentColor = parentProject.color || "rgba(0, 0, 0, 1)"; // Default color if none exists
        const data = new Array(weeks.length).fill(0); // Initialize data array for weeks

        tasks.forEach((task) => {
          const completedDate = new Date(task.completeDate);
          completedDate.setHours(0, 0, 0, 0); // Normalize completedDate to midnight

          // Find the week in which the task was completed
          weeks.forEach((week, index) => {
            if (completedDate >= week.start && completedDate <= week.end) {
              data[index]++;
            }
          });
        });

        datasets.push({
          label: parentTitle,
          data: data,
          borderColor: parentColor, // Set borderColor to parent's color
          backgroundColor: `${parentColor}80`, // Set backgroundColor with 50% opacity (80 in hex)
        });
      }
    }

    // Prepare the labels as week ranges (e.g., "Week 1: 11/01 - 11/07")
    const labels = weeks.map((week, index) => {
      return `${formatDate(week.start)} - ${formatDate(week.end)}`;
    });

    console.log(labels, datasets);

    return NextResponse.json({
      graphTitle: graphTitle, // Added graphTitle
      labels: labels,
      datasets: datasets,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "API failed" }, { status: 500 });
  }
}
