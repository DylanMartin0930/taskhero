"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";

export default function UserProfile({ params }: any) {
  const router = useRouter();
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      console.log("Logout success");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <br />
      <p className="text-4xl">
        Profile Page
        <span className="p-2 rounded bg-purple-500 text-black">
          {params.id}
        </span>
      </p>
      <hr />

      <button
        onClick={logout}
        className="p-2 bg-blue-300 mt-4 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
      >
        Logout{" "}
      </button>
    </div>
  );
}
