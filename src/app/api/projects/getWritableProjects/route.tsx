import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Cryptr from "cryptr";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body to get the isDefault value
    const { canWrite } = await request.json();
    // Get user from token
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find projects and only return titles and _id fields
    const projects = await Project.find({
      userId: userID,
      canWrite: canWrite,
    }).select("title _id");

    console.log(projects);

    if (!projects || projects.length === 0) {
      return NextResponse.json({ error: "No projects found" }, { status: 404 });
    }

    // Hash each project's _id using bcryptjs
    const cryptr = new Cryptr(process.env.TOKEN_SECRET);
    const hashedProjects = await Promise.all(
      projects.map(async (project) => {
        const encryptedID = cryptr.encrypt(project._id);
        return {
          title: project.title,
          _id: encryptedID,
        };
      }),
    );

    return NextResponse.json({
      message: "Projects Found",
      data: hashedProjects,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "getTask API Failed" }, { status: 500 });
  }
}
