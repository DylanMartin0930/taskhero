import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
	try {
		const { username, oldPassword, password } = await request.json();

		// Get user from token
		const userID = getDataFromToken(request);
		const user = await User.findOne({ _id: userID });

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// If updating password, verify old password first
		if (oldPassword && password) {
			// Verify old password
			const validPassword = await bcryptjs.compare(oldPassword, user.password);
			if (!validPassword) {
				return NextResponse.json(
					{ error: "Current password is incorrect" },
					{ status: 400 }
				);
			}

			// Hash new password
			const salt = await bcryptjs.genSalt(10);
			const hashedNewPassword = await bcryptjs.hash(password, salt);
			user.password = hashedNewPassword;
		}

		// Update username if provided
		if (username && username !== user.username) {
			// Check if username is already taken
			const existingUser = await User.findOne({
				username,
				_id: { $ne: userID }, // Exclude current user from check
			});

			if (existingUser) {
				return NextResponse.json(
					{ error: "Username already taken" },
					{ status: 400 }
				);
			}

			user.username = username;
		}

		await user.save();

		return NextResponse.json({
			message: "User info updated successfully",
			success: true,
			user: {
				username: user.username,
				isVerified: user.isVerified,
				verifiedOn: user.verifiedOn,
			},
		});
	} catch (error: any) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to update user info" },
			{ status: 500 }
		);
	}
}
