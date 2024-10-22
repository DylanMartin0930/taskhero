import React from "react";
import Link from "next/link";
import { USER_ITEMS } from "@/constants/useritems";

function Dropdown() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDropdown = async () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="absolute">
      <button
        onClick={handleDropdown}
        className="mt-2 bg-white text-black rounded-md border border-black w-48"
      >
        Dropdown
      </button>
      {isOpen && (
        <div className="z-40 top-full bg-white text-black mt-[1px] rounded-md border border-black w-48">
          {USER_ITEMS.map((items, index) => (
            <div key={index}>
              <Link
                key={items.title}
                href={items.path}
                className="block items-center"
              >
                {items.icon}
                <span>{items.title}</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
