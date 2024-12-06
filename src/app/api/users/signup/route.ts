import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    //remove for production build
    console.log(reqBody);

    //check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exist" },
        { status: 400 },
      );
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    //create new user
    console.log("Creating new user");
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      currentStreak: 0,
      longestStreak: 0,
      completedTasks: 0,
      lasTaskCompleted: null,
    });

    console.log("New user created");

    const savedUser = await newUser.save();
    console.log(savedUser);

    // send verification email

    await sendEmail({
      email,
      emailType: "VERIFY",
      userID: savedUser._id,
    });

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
