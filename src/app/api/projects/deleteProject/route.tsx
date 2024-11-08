import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Project from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json();
    console.log(projectId);

    //get user from database
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const project = await Project.findOne({ _id: projectId, userId: userID });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    await project.deleteOne({ _id: projectId });

    return NextResponse.json({
      message: "Project Deleted successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Project Delete Failed" },
      { status: 500 },
    );
  }
}
