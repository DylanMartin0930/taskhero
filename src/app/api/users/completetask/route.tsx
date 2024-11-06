import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Task from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

// /api/users/login/route.tsx
export async function POST(request: NextRequest) {
  try {
    //extract taskID from request body
    const { taskId } = await request.json();

    //get user from database
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the task by TaskID and update completeStatus
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId: userID }, // Ensure the task belongs to the user
      { Completestatus: true, completeDate: Date.now() }, // Update completeStatus to true
      { new: true }, // Return the updated document
    );

    if (!updatedTask) {
      return NextResponse.json(
        { error: "Task not found or not authorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Tasks Completed!",
      data: updatedTask,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "getTask API Failed" }, { status: 500 });
  }
}
