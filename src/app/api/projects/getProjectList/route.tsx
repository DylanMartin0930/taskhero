import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Cryptr from "cryptr";
import { NextRequest, NextResponse } from "next/server";

// Connect to database once when module is loaded
connect();

// Cache the Cryptr instance
const cryptr = new Cryptr(process.env.TOKEN_SECRET!);

export async function POST(request: NextRequest) {
	try {
		const { isDefault } = await request.json();
		const userID = getDataFromToken(request);

		// Use lean() for better performance when we only need to read data
		// Only select _id field since we just need to verify existence
		const user = await User.findOne({ _id: userID }).select("_id").lean();

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Optimize query by:
		// 1. Only selecting needed fields
		// 2. Using lean() for better performance
		const projects = await Project.find({
			userId: userID,
			isDefault: isDefault,
		})
			.select("title _id")
			.lean();

		// Early return for empty results
		if (!projects?.length) {
			return NextResponse.json({ data: [] });
		}

		// Process projects in parallel for better performance
		const hashedProjects = await Promise.all(
			projects.map((project) => ({
				title: project.title,
				_id: cryptr.encrypt(project._id.toString()),
			}))
		);

		return NextResponse.json({
			message: "Projects Found",
			data: hashedProjects,
		});
	} catch (error) {
		console.error("getProjectList API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch projects" },
			{ status: 500 }
		);
	}
}
