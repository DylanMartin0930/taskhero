import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

// /api/users/login/route.tsx
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    //check if user already exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 500 },
      );
    }

    console.log("|DEBUG| User found");

    //check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }
    //check if user is verified
    if (user.isVerified === false) {
      return NextResponse.json({ error: "User not verified" }, { status: 400 });
    }

    //api/users/login/route.tsx
    //create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      readAccess: user.readAccess,
      writeAccess: user.writeAccess,
    };

    //create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 9000000),
      maxAge: 9000000,
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
