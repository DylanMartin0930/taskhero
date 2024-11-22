import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Project from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Cryptr from "cryptr";

connect();

export async function POST(request: NextRequest) {
  try {
    //extract the folder name from request body
    const { token } = await request.json();
    console.log("TOKEN: ", token);

    //dectypt the token
    const cryptr = new Cryptr(process.env.TOKEN_SECRET);
    const decryptedToken = cryptr.decrypt(token);

    //get user from database
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const project = await Project.findOne({
      _id: decryptedToken,
      userId: userID,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Project Found",
      data: project,
    });

    //get user from database
  } catch (error: any) {
    return NextResponse.json({ error: "getTask API Failed" }, { status: 500 });
  }
}
