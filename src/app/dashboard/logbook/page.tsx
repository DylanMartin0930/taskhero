"use client";
import React from "react";
import LogbookWrapper from "@/components/ui/logbookwrapper";

export default function Logbook() {
  return (
    <div className="text-black h-screen flex flex-col p-[10px]">
      <h1 className="text-xl mb-4">Logbook</h1>
      <hr />
      <div className="w-full">
        <LogbookWrapper folder={"Logbook"} />
      </div>
    </div>
  );
}
