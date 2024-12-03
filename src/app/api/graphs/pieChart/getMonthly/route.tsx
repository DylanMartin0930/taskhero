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
    const cryptr = new Cryptr(process.env.TOKEN_SECRET);
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

    // Get the current date and calculate the date 30 days ago
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    // Track unique `parent` attributes and their occurrence counts
    const parentCounts = {};
    project.tasks.forEach((task) => {
      // Only consider tasks where completeDate is within the last 30 days
      if (
        task.completeDate &&
        new Date(task.completeDate) >= thirtyDaysAgo &&
        new Date(task.completeDate) <= currentDate
      ) {
        if (task.parent) {
          parentCounts[task.parent] = (parentCounts[task.parent] || 0) + 1;
        }
      }
    });

    // Prepare labels, data, and background colors
    const labels = [];
    const data = [];
    const parentIds = Object.keys(parentCounts);
    const borderColor = [];

    for (let i = 0; i < parentIds.length; i++) {
      const parentId = parentIds[i];
      const count = parentCounts[parentId];

      // Fetch the title and color of the parent project
      const parentProject = await Project.findOne({
        _id: parentId,
        userId: userID,
      });

      if (parentProject) {
        labels.push(parentProject.title);
        data.push(count);

        const parentColor = parentProject.color || "rgba(0, 0, 0, 1)"; // Default color if no color exists
        borderColor.push(parentColor); // Set borderColor to parent's color
      }
    }

    console.log(labels, data, borderColor);

    return NextResponse.json({
      labels,
      datasets: [
        {
          label: "Directories",
          data,
          borderColor,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "API failed" }, { status: 500 });
  }
}
