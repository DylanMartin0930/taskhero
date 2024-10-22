import React from "react";
import Link from "next/link";
import { DEFAULT_ITEMS } from "@/constants/defaultitems";

export const DefaultOptions = () => {
  return (
    <div className="flex-1 mt-[20px]">
      {DEFAULT_ITEMS.map((items) => (
        <Link key={items.title} href={items.path} className="block">
          {items.title}
        </Link>
      ))}
    </div>
  );
};
