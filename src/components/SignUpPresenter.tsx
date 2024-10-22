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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing..." : "Login"}</h1>
      <hr />
      {/* Username*/}
      <label htmlFor="email">Email</label>
      <input
        name="username"
        type="text"
        className="text-black"
        placeholder="Username"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      {/* Email */}
      <label htmlFor="email">Email</label>
      <input
        name="email"
        type="text"
        className="text-black"
        placeholder="Email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      {/* Password */}
      <label htmlFor="password">Password</label>
      <input
        name="password"
        type="password"
        className="text-black"
        placeholder="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button
        onClick={onSignup}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-white"
        disabled={buttonDisabled}
      >
        {buttonDisabled ? "Missing Field" : "Sign Up"}
      </button>
      <Link href="/login">Visit Login Page</Link>
    </div>
  );
}
