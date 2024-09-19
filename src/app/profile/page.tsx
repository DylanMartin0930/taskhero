"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
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

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data._id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <br />
      <p>Profile Page</p>
      <h2 className="p-3 rounded bg-green-500">
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={"/profile/${data}"}>{data}</Link>
        )}
      </h2>
      <hr />

      <button
        onClick={logout}
        className="p-2 bg-blue-300 mt-4 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
      >
        Logout
      </button>

      <button
        onClick={getUserDetails}
        className="p-2 bg-purple-300 mt-4 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
      >
        Get User Details
      </button>
    </div>
  );
}
