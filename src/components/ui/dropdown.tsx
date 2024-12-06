"use client";
import React from "react";
import Link from "next/link";
import { USER_ITEMS } from "@/constants/useritems";

function Dropdown(props) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="">
      <button
        onClick={handleDropdown}
        className="bg-[#d9d9d9] hover:bg-[#b3b3b3] text-black border border-black w-full"
      >
        {props.userName}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`transition-all duration-300 overflow-hidden z-40 top-full bg-[#d9d9d9] text-black border border-black w-full ${
          isOpen
            ? "h-auto opacity-100" // Open state
            : "h-0 opacity-0" // Closed state
        }`}
      >
        {isOpen &&
          USER_ITEMS.map((item, index) => (
            <div key={index}>
              <Link
                href={
                  item.path === "/logout" // Check if the path is "logout"
                    ? `${item.path}` // Don't append userId for "logout"
                    : `${item.path}${props.userId}` // Append userId otherwise
                }
                className="p-1 border-b-2 border-black block items-center hover:bg-[#b3b3b3]"
              >
                <span>{item.title}</span>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Dropdown;
