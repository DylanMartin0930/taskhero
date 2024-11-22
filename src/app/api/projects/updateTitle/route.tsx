import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Project from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Cryptr from "cryptr";

connect();

export async function POST(request: NextRequest) {
  try {
    const { projectId, newTitle } = await request.json();
    console.log(projectId, newTitle);

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

    // Update the project title
    project.title = newTitle;
    await project.save();

    return NextResponse.json({
      message: "Project title updated successfully",
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Project title update failed" },
      { status: 500 },
    );
  }
}
