// SignupPagePresenter.tsx
import React from "react";
import Link from "next/link";
import InputField from "./InputField";

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
      <h1>{loading ? "Processing..." : "Sign Up"}</h1>
      <hr />

      {/* Username */}
      <label htmlFor="username">Username</label>
      <InputField
        formType={"username"}
        user={user}
        setUser={setUser}
        idType={"username"}
      />

      {/* Email */}
      <label htmlFor="email">Email</label>
      <InputField
        formType={"email"}
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
        onClick={onSignup}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-white"
      >
        {buttonDisabled ? "Missing Field" : "Sign Up"}
      </button>

      <Link href="/login">Visit Login Page</Link>
    </div>
  );
}
