"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const LogOutMutation = useMutation({
    mutationFn: async () => {
      await axios.get("/api/users/logout");
    },
    onSuccess: () => {
      toast.success("Logout successful");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error.message);
      setLoading(false);
    },
  });

  useEffect(() => {
    LogOutMutation.mutate();
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
