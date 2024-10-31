"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState("inbox");
  const [data, setData] = useState("nothing");

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/me");
      console.log(res.data);
      setData(res.data.data._id);
    } catch (error: any) {
      console.log("ERROR");
    }
  };

  const defaultRoute = async () => {
    router.push("/dashboard/inbox");
  };

  useEffect(() => {
    defaultRoute();
  }, []);

  return (
    <div className="w-full h-screen bg-purple-200">
      {/* Dynamicly render page based on navbar selection */}
      {/* {setPage()} */}
      HELLO FROM DASHBOARD
    </div>
  );
}
