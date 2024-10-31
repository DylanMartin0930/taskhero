import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Task from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { taskId } = reqBody;
    console.log(reqBody);

    //get user from database
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const task = await Task.findOne({ _id: taskId, userId: userID });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    await Task.deleteOne({ _id: taskId });

    await user.save();

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
