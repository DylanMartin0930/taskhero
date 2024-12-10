import UserInfoCard from "@/components/ui/UserInfoCard";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import toast from "react-hot-toast";
import { describe, expect, it, vi } from "vitest";

// Mock axios and toast
vi.mock("axios");
vi.mock("react-hot-toast", () => ({
	default: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

describe("UserInfoCard", () => {
	const mockUserInfo = {
		username: "testuser",
		email: "test@example.com",
		isVerified: true,
		verifiedOn: new Date("2024-03-20"),
	};

	const mockRefetch = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders user information correctly", () => {
		render(<UserInfoCard userInfo={mockUserInfo} refetch={mockRefetch} />);

		// Basic info
		expect(screen.getByText("testuser")).toBeInTheDocument();
		expect(screen.getByText("test@example.com")).toBeInTheDocument();
		expect(screen.getByText("Verified")).toBeInTheDocument();

		// Date verification - using a more flexible approach
		const dateElement = screen.getByText((content) => {
			return (
				content.includes("March") &&
				content.includes("20") &&
				content.includes("2024")
			);
		});
		expect(dateElement).toBeInTheDocument();
	});

	it("toggles edit mode when edit button is clicked", () => {
		render(<UserInfoCard userInfo={mockUserInfo} refetch={mockRefetch} />);

		// Initial state - edit mode off
		expect(
			screen.queryByLabelText(/current password/i)
		).not.toBeInTheDocument();

		// Click edit button
		fireEvent.click(screen.getByText("Edit Profile"));

		// Check if password fields are now visible
		expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();

		// Click cancel button
		fireEvent.click(screen.getByText("Cancel Edit"));

		// Check if password fields are hidden again
		expect(
			screen.queryByLabelText(/current password/i)
		).not.toBeInTheDocument();
	});

	it("handles form submission successfully", async () => {
		vi.mocked(axios.post).mockResolvedValueOnce({
			data: {
				success: true,
				message: "Profile updated",
				user: {
					username: "newusername",
				},
			},
		});

		render(<UserInfoCard userInfo={mockUserInfo} refetch={mockRefetch} />);

		// Enter edit mode
		fireEvent.click(screen.getByText("Edit Profile"));

		// Update username
		const usernameInput = screen.getByDisplayValue("testuser");
		fireEvent.change(usernameInput, { target: { value: "newusername" } });

		// Enter passwords
		fireEvent.change(screen.getByLabelText("Current Password"), {
			target: { value: "oldpass" },
		});
		fireEvent.change(screen.getByLabelText("New Password"), {
			target: { value: "newpass" },
		});

		// Submit form
		fireEvent.click(screen.getByText("Save Changes"));

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith("/api/users/editUserInfo", {
				username: "newusername",
				oldPassword: "oldpass",
				password: "newpass",
			});
			expect(toast.success).toHaveBeenCalled();
			expect(mockRefetch).toHaveBeenCalled();
		});
	});

	it("handles form submission error", async () => {
		const errorMessage = "Invalid password";
		vi.mocked(axios.post).mockRejectedValueOnce({
			response: { data: { error: errorMessage } },
		});

		render(<UserInfoCard userInfo={mockUserInfo} refetch={mockRefetch} />);

		// Enter edit mode
		fireEvent.click(screen.getByText("Edit Profile"));

		// Submit form
		fireEvent.click(screen.getByText("Save Changes"));

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(errorMessage);
		});
	});

	it("displays unverified status correctly", () => {
		const unverifiedUser = {
			...mockUserInfo,
			isVerified: false,
			verifiedOn: undefined,
		};

		render(<UserInfoCard userInfo={unverifiedUser} refetch={mockRefetch} />);

		expect(screen.getByText("Not Verified")).toBeInTheDocument();
		expect(screen.queryByText(/verified on/i)).not.toBeInTheDocument();
	});
});
