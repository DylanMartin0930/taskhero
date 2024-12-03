import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Project from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Cryptr from "cryptr";

connect();

// Helper function to convert hex to rgba
function hexToRgba(hex) {
  // Remove the hash (#) if present
  hex = hex.replace("#", "");

  // Convert shorthand hex (#abc) to full hex (#aabbcc)
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((x) => x + x)
      .join("");
  }

  // Extract RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Return rgba string with alpha set to 1
  return `rgba(${r},${g},${b},1)`;
}

export async function POST(request: NextRequest) {
  try {
    const { projectId, newTitle, newColor } = await request.json();
    console.log(projectId, newTitle, newColor);

    const cryptrInstance = new Cryptr(process.env.TOKEN_SECRET);
    const decryptedId = cryptrInstance.decrypt(projectId);

    // Get user from database
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the project and ensure it belongs to the user
    const project = await Project.findOne({ _id: decryptedId, userId: userID });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update the project title only if newTitle is provided
    project.title = newTitle ? newTitle : project.title;

    // Convert hex color to rgba and update the color only if newColor is provided
    const rgbaColor = hexToRgba(newColor);
    project.color = newColor ? rgbaColor : project.color;

    // Save the project with the updated values
    await project.save();

    return NextResponse.json({
      message: "Project updated successfully",
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Project update failed" },
      { status: 500 },
    );
  }
}
