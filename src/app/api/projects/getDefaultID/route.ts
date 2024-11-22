import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Project from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
  try {
    // Get userID from the request body
    const userID = getDataFromToken(request);
    console.log(userID);

    // Ensure the user is authenticated (this part may be redundant if you're already extracting userID from the token)
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Search for the specific projects: "Inbox", "Today", "Logbook", "Trash"
    const projects = await Project.find({
      userId: userID, // Filter by the user ID
      title: { $in: ["Inbox", "Today", "Logbook", "Trash"] }, // Filter by the project titles
    });

    if (!projects || projects.length === 0) {
      return NextResponse.json(
        { error: "Projects not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Projects found",
      projects: projects, // Returning the project IDs with their titles
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
