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
    const reqBody = await request.json();
    const { task, selectedProject } = reqBody;

    console.log("REQ BODY", reqBody);
    // Check for missing fields
    if (!task.title || !task.description) {
      return NextResponse.json(
        { error: "Please provide all fields" },
        { status: 400 }, // Bad Request
      );
    }

    const cryptr = new Cryptr(process.env.TOKEN_SECRET);
    const decryptedProject = cryptr.decrypt(selectedProject);

    //get user from database
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentProject = await Project.findOne({
      _id: decryptedProject,
      userId: userID,
    });
    console.log("project found");

    if (!currentProject) {
      return NextResponse.json(
        { error: "Project not found or not owned by user" },
        { status: 404 },
      );
    }

    // Prepare new task subdocument
    const newTask = {
      title: task.title,
      parent: decryptedProject,
      folder: currentProject.title,
      description: task.description,
      createdDate: new Date(),
      dueDate: task.dueDate,
      assignedDate: task.assignedDate,
      completestatus: false, // Default to not completed
    };

    // Add the new task subdocument to the project's tasks array
    currentProject.tasks.push(newTask);

    // Save the updated project
    await currentProject.save();

    return NextResponse.json({
      message: "User Found and Task Added",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
