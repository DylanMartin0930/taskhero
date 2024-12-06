import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Cryptr from "cryptr"; // Import Cryptr

connect();

// /api/users/login/route.tsx
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    // Check if user already exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 500 },
      );
    }

    console.log("|DEBUG| User found");

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Check if user is verified
    if (user.isVerified === false) {
      return NextResponse.json({ error: "User not verified" }, { status: 400 });
    }

    // Use Cryptr to encrypt the user's _id
    const cryptr = new Cryptr(process.env.TOKEN_SECRET!); // Initialize Cryptr with the secret key
    const encryptedUserId = cryptr.encrypt(user._id.toString()); // Encrypt the _id

    // API/users/login/route.tsx
    // Create token data
    const tokenData = {
      id: user._id, // Use encrypted _id instead of original _id
      username: user.username,
      email: user.email,
    };
    console.log("|DEBUG| Token data created", tokenData);

    // Create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      encryptedUserId, // Include the encrypted _id in the response
    });

    const fourHours = 4 * 60 * 60;
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: fourHours,
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
