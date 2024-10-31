"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      console.log("Logout success");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
      setLoading(false);
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    logout(); // Call logout function when component mounts
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-center">
      {loading ? (
        <p className="text-6xl font-bold text-white">Logging out...</p>
      ) : (
        <p className="text-6xl font-bold text-white">
          You have been logged out.
        </p>
      )}
    </div>
  );
}
