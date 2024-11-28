import React from "react";
import Link from "next/link";
import { USER_ITEMS } from "@/constants/useritems";

function Dropdown(props) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDropdown = async () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="">
      <button
        onClick={handleDropdown}
        className="bg-[#d9d9d9] hover:bg-[#b3b3b3] text-black border border-black w-full"
      >
        {props.userInfo}
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
          USER_ITEMS.map((items, index) => (
            <div key={index}>
              <Link
                href={items.path}
                className="p-1 border-b-2 border-black block items-center hover:bg-[#b3b3b3]"
              >
                <span>{items.title}</span>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Dropdown;
