"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();

  const defaultRoute = async () => {
    router.push("/dashboard/inbox");
  };

  useEffect(() => {
    defaultRoute();
  });

  return (
    <div className="w-full h-screen bg-purple-200">
      {/* Dynamicly render page based on navbar selection */}
      {/* {setPage()} */}
      HELLO FROM DASHBOARD
    </div>
  );
}
