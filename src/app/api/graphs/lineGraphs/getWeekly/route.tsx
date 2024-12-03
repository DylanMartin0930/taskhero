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

    // Calculate the date range for the last 7 days (including today)
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 6); // Include today, so 6 days back

    // Normalize both currentDate and sevenDaysAgo to midnight to avoid timezone issues
    currentDate.setHours(0, 0, 0, 0);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Helper function to format dates as "mm/dd/yy"
    const formatDate = (date) => {
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure two-digit month
      const day = date.getDate().toString().padStart(2, "0"); // Ensure two-digit day
      const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
      return `${month}/${day}/${year}`;
    };

    // Create the graphTitle with the required date format
    const graphTitle = `Last 7 Days: ${formatDate(sevenDaysAgo)} - ${formatDate(currentDate)}`;

    // Filter tasks completed within the last 7 days
    const completedTasks = project.tasks.filter((task) => {
      const completedDate = new Date(task.completeDate); // Ensure `completeDate` is in your schema
      completedDate.setHours(0, 0, 0, 0); // Normalize to midnight
      return (
        task.completestatus &&
        completedDate >= sevenDaysAgo &&
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

    // Prepare data for response
    const labels = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i); // Move one day forward in the date range

      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      // Check if it's the current day and append "(today)" on a new line
      if (
        date.toLocaleDateString("en-US", { weekday: "long" }) ===
        currentDate.toLocaleDateString("en-US", { weekday: "long" })
      ) {
        return `${dayName} (Today)`; // Add <br> for line break
      }

      return dayName; // Only return the day of the week for other days
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
        const data = new Array(7).fill(0); // Initialize data array for 7 days

        tasks.forEach((task) => {
          const completedDate = new Date(task.completeDate);
          completedDate.setHours(0, 0, 0, 0); // Normalize completedDate to midnight

          const dayIndex = Math.floor(
            (completedDate - sevenDaysAgo) / (1000 * 60 * 60 * 24),
          );

          if (dayIndex >= 0 && dayIndex < 7) {
            data[dayIndex]++;
          }
        });

        datasets.push({
          label: parentTitle,
          data: data,
          borderColor: parentColor, // Set borderColor to parent's color
          backgroundColor: `${parentColor}80`, // Set backgroundColor with 50% opacity (80 in hex)
        });
      }
    }

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
