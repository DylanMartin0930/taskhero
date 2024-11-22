"use client";
import React, { useEffect, useState } from "react";
import Calendar from "@/components/ui/calendar";
export default function Upcoming({ params }: any) {
  return (
    <div className="bg-green-100 text-black">
      <h1>Hello from Calendar</h1>
      <Calendar />
    </div>
  );
}
