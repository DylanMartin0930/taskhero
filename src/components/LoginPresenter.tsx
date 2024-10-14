"use client";
import React from "react";
import Link from "next/link";
import InputField from "./InputField";

interface LoginPagePresenterProps {
  user: { email: string; password: string };
  setUser: (user: { email: string; password: string }) => void;
  onLogin: () => void;
  buttonDisabled: boolean;
  loading: boolean;
}

export default function LoginPagePresenter({
  loading,
  user,
  setUser,
  onLogin,
  buttonDisabled,
}: LoginPagePresenterProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing..." : "Login"}</h1>
      <hr />
      {/* Email */}
      <label htmlFor="email">Email</label>
      <InputField
        formType={"text"}
        user={user}
        setUser={setUser}
        idType={"email"}
      />
      {/* Password */}
      <label htmlFor="password">Password</label>
      <InputField
        formType={"password"}
        user={user}
        setUser={setUser}
        idType={"password"}
      />
      <button
        onClick={onLogin}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-white"
      >
        {buttonDisabled ? "Missing Field" : "Login"}
      </button>
      <Link href="/signup">Visit Signup Page</Link>
    </div>
  );
}
