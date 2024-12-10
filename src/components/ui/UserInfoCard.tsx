import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

interface UserInfoProps {
	userInfo: {
		username: string;
		email: string;
		verifiedOn?: Date;
		isVerified: boolean;
	};
	refetch: () => void;
}

export default function UserInfoCard({ userInfo, refetch }: UserInfoProps) {
	const [isEditing, setIsEditing] = React.useState(false);
	const [formData, setFormData] = React.useState({
		username: userInfo.username,
		oldPassword: "",
		password: "",
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Format the verification date if it exists
	const formatDate = (date: Date | undefined) => {
		if (!date) return "Not verified";
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const handleSaveChanges = async () => {
		try {
			const response = await axios.post("/api/users/editUserInfo", formData);
			if (response.data.success) {
				toast.success(response.data.message);
				setIsEditing(false);
				// Update the local user info with the new data
				setFormData((prev) => ({
					...prev,
					username: response.data.user.username,
					oldPassword: "",
					password: "",
				}));
				// Add refetch here to update user data
				refetch();
			}
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.error || "Failed to update user info";
			toast.error(errorMessage);
		}
	};

	return (
		<div className="bg-[#b3b3b3] text-black border-2 border-black p-4 rounded-sm w-full">
			<div className="space-y-4">
				{/* Username Section */}
				<div className="flex flex-col">
					<label className="text-sm font-semibold">Username</label>
					{isEditing ? (
						<input
							type="text"
							name="username"
							value={formData.username}
							onChange={handleInputChange}
							className="text-lg p-1 rounded border border-gray-300"
						/>
					) : (
						<span className="text-lg">{userInfo.username}</span>
					)}
					<hr className="border-t border-black my-2" />
				</div>

				{/* Email Section - Only shown when not editing */}
				{!isEditing && (
					<div className="flex flex-col">
						<label className="text-sm font-semibold">Email</label>
						<span className="text-lg">{userInfo.email}</span>
						<hr className="border-t border-black my-2" />
					</div>
				)}

				{/* Password Sections - Only shown when editing */}
				{isEditing && (
					<>
						<div className="flex flex-col">
							<label
								htmlFor="currentPassword"
								className="text-sm font-semibold"
							>
								Current Password
							</label>
							<input
								id="currentPassword"
								type="password"
								name="oldPassword"
								value={formData.oldPassword}
								onChange={handleInputChange}
								className="text-lg p-1 rounded border border-gray-300"
							/>
							<hr className="border-t border-black my-2" />
						</div>
						<div className="flex flex-col">
							<label htmlFor="newPassword" className="text-sm font-semibold">
								New Password
							</label>
							<input
								id="newPassword"
								type="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								className="text-lg p-1 rounded border border-gray-300"
							/>
							<hr className="border-t border-black my-2" />
						</div>
					</>
				)}

				{/* Verification Section */}
				<div className="flex flex-col">
					<div className="flex justify-between items-center">
						<div>
							<label className="text-sm font-semibold">Account Status</label>
							<div className="flex items-center space-x-2">
								<span
									className={`text-lg ${
										userInfo.isVerified ? "text-green-700" : "text-red-700"
									}`}
								>
									{userInfo.isVerified ? "Verified" : "Not Verified"}
								</span>
								{userInfo.isVerified && (
									<span className="text-sm text-gray-600">
										(Verified on {formatDate(userInfo.verifiedOn)})
									</span>
								)}
							</div>
						</div>
						<div className="space-x-2">
							<button
								onClick={() => setIsEditing(!isEditing)}
								className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
							>
								{isEditing ? "Cancel Edit" : "Edit Profile"}
							</button>
							{isEditing && (
								<button
									onClick={handleSaveChanges}
									className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
								>
									Save Changes
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
