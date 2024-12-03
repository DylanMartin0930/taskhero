// SignupPagePresenter.tsx
import React from "react";
import Link from "next/link";

interface SignupPagePresenterProps {
  loading: boolean;
  user: { email: string; password: string; username: string };
  setUser: React.Dispatch<
    React.SetStateAction<{ email: string; password: string; username: string }>
  >;
  buttonDisabled: boolean;
  onSignup: () => void;
}

export default function SignupPagePresenter({
  loading,
  user,
  setUser,
  buttonDisabled,
  onSignup,
}: SignupPagePresenterProps) {
  return (
    <div className="bg-[#fdf5e8] flex items-center justify-center min-h-screen">
      <div className="bg-[#b3b3b3] p-6 text-black shadow-md shadow-black border-2 border-black flex flex-col items-center w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-2">Task Hero</h1>
        <p className="text-md text-gray-700 mb-4 text-center">
          Unleash Your Productivity One Task at a Time
        </p>
        <hr className="w-full border-t border-black mb-4" />
        {/* Username */}
        <input
          name="username"
          type="text"
          className="w-full mb-4 p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />
        {/* Email */}
        <input
          name="email"
          type="text"
          className="w-full mb-4 p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        {/* Password */}
        <input
          name="password"
          type="password"
          className="w-full mb-4 p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <button
          onClick={onSignup}
          className={`w-full p-2 border-2 border-black mb-4 ${
            buttonDisabled
              ? "bg-[#777777] cursor-not-allowed text-white"
              : "bg-[#d9d9d9] hover:bg-[#b3b3b3] text-black"
          }`}
          disabled={buttonDisabled}
        >
          {buttonDisabled ? "Missing Field" : "Sign Up"}
        </button>
        <Link href="/login" className="text-blue-500 hover:underline">
          Visit Login Page
        </Link>
      </div>
    </div>
  );
}
