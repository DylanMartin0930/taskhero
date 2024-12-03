import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Cryptr from "cryptr";
import { NextRequest, NextResponse } from "next/server";

connect();

// Function to generate a random pastel rgba color
function generatePastelColor() {
  // Generate random values for red, green, and blue in the pastel range (light and soft colors)
  const r = Math.floor(Math.random() * 128 + 128); // RGB values between 128 and 255
  const g = Math.floor(Math.random() * 128 + 128);
  const b = Math.floor(Math.random() * 128 + 128);

  // Return the rgba color with 100% opacity (alpha = 1)
  return `rgba(${r}, ${g}, ${b}, 1)`;
}

// /api/users/login/route.tsx
export async function POST(request: NextRequest) {
  try {
    // Get user from token and database
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a random pastel color for the project
    const projectColor = generatePastelColor();

    // Create a new project with the random color
    const newProject = new Project({
      title: "New Project",
      userId: userID,
      canWrite: true,
      color: projectColor, // Assign the random pastel color
    });

    // Save the project
    const savedProject = await newProject.save();

    // Encrypt the project's _id using Cryptr
    const cryptr = new Cryptr(process.env.TOKEN_SECRET);
    const encryptedId = cryptr.encrypt(savedProject._id.toString());

    // Respond with the project's title, encrypted _id, and the assigned color
    return NextResponse.json({
      message: "New Project Created",
      data: {
        title: savedProject.title,
        encryptedId: encryptedId,
        color: projectColor, // Include the color in the response
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
