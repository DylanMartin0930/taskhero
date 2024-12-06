import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import Cryptr from "cryptr";

connect();

export async function GET(request: NextRequest) {
  try {
    // Get the userID from the token
    const userID = await getDataFromToken(request);
    console.log("User ID: ", userID);

    // Initialize Cryptr with your encryption key
    const cryptr = new Cryptr(process.env.TOKEN_SECRET!);
    // Fetch the user from the database
    const user = await User.findOne({ _id: userID }).select("-password");
    console.log("Current Streak: ", user.currentStreak);
    console.log("Longest Streak: ", user.longestStreak);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Encrypt the user _id using Cryptr
    const encryptedUserId = cryptr.encrypt(user._id.toString());

    return NextResponse.json({
      message: "User Found",
      data: {
        user, // Convert the user document to a plain object
        encryptedUserId, // Add the encrypted _id to the response
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
