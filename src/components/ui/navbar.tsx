"use client";
import Dropdown from "./dropdown";
import { DefaultOptions } from "./defaultoptions";
import React from "react";

export default function Navbar() {
  return (
    <div className="fixed flex flex-col space-y-[10px] top-[60px] left-0 w-[300px] p-[10px] h-screen bg-gray-800">
      {/* Logo */}
      <div>
        <h1>TaskHero</h1>
      </div>

      {/* User */}
      <div className="">
        <Dropdown />
      </div>

      {/* Default Routes */}
      <div>
        <DefaultOptions />
      </div>
    </div>
  );
}
