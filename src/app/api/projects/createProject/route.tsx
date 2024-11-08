import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Project from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

// /api/users/login/route.tsx
export async function POST(request: NextRequest) {
  try {
    //get user from database
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newProject = new Project({
      title: "New Project",
      userId: userID,
    });

    // Save the task
    const savedProject = await newProject.save();

    return NextResponse.json({
      message: "New Project Created",
      data: savedProject,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
