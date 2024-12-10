import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Please provide a username"],
		unique: true,
	},
	email: {
		type: String,
		required: [true, "Please provide a email"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please provide a password"],
	},

	isVerified: {
		type: Boolean,
		default: false,
	},

	isAdmin: {
		type: Boolean,
		default: false,
	},

	completedTasks: {
		type: Number,
		default: 0,
	},

	currentStreak: {
		type: Number,
		default: 0,
	},

	longestStreak: {
		type: Number,
		default: 0,
	},

	lastTaskCompleted: {
		type: Date,
		default: null,
	},

	forgotPasswordToken: String,
	forgotPasswordExpiry: Date,
	verifyToken: String,
	verifyTokenExpiry: Date,
	verifiedOn: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
