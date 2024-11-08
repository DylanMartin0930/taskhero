import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Task from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

// /api/users/login/route.tsx
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { title, description, dueDate, assignedDate } = reqBody;
    console.log(dueDate);
    // Check for missing fields
    if (!title || !description) {
      return NextResponse.json(
        { error: "Please provide all fields" },
        { status: 400 }, // Bad Request
      );
    }
    console.log(reqBody);

    //get user from database
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newTask = new Task({
      title: title,
      description: description,
      dueDate: dueDate,
      assignedDate: assignedDate,
      userId: userID,
    });

    // Save the task
    const savedTask = await newTask.save();

    return NextResponse.json({
      message: "User Found and Task Added",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
