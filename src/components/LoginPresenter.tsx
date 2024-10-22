"use client";
import React from "react";
import Link from "next/link";
import InputField from "./InputField";

export default function LoginPagePresenter({
  loading,
  user,
  setUser,
  onLogin,
  buttonDisabled,
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing..." : "Login"}</h1>
      <hr />
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
        onClick={onLogin}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-white"
        disabled={buttonDisabled}
      >
        {buttonDisabled ? "Missing Field" : "Login"}
      </button>
      <Link href="/signup">Visit Signup Page</Link>
    </div>
  );
}
