"use client";
import React, { useEffect, useState } from "react";
import Calendar from "@/components/ui/calendar";
export default function Upcoming({ params }: any) {
  return (
    <div className="bg-[#d9d9d9] text-black h-screen overflow-auto">
      <Calendar />
    </div>
  );
}
