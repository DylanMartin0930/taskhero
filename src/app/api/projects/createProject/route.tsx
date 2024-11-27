import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Cryptr from "cryptr";
import { NextRequest, NextResponse } from "next/server";

connect();

// /api/users/login/route.tsx
export async function POST(request: NextRequest) {
  try {
    // Get user from token and database
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a new project
    const newProject = new Project({
      title: "New Project",
      userId: userID,
      canWrite: true,
    });

    // Save the project
    const savedProject = await newProject.save();

    // Encrypt the project's _id using Cryptr
    const cryptr = new Cryptr(process.env.TOKEN_SECRET);
    const encryptedId = cryptr.encrypt(savedProject._id.toString());

    // Respond with the project's title and encrypted _id
    return NextResponse.json({
      message: "New Project Created",
      data: {
        title: savedProject.title,
        encryptedId: encryptedId,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
