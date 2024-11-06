import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Task from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { completeTask } from "@/components/queries/completeTask";

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

    const tasks = await Task.find({
      userId: userID,
      Completestatus: true, // Filter by complete status
    });

    if (tasks.length === 0) {
      return NextResponse.json({
        message: "No tasks found",
        data: [],
      });
    }

    return NextResponse.json({
      message: "Tasks Found",
      data: tasks,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "getTask API Failed" }, { status: 500 });
  }
}
