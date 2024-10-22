import { DefaultOptions } from "@/components/ui/defaultoptions";
import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import React from "react";
import { DEFAULT_ITEMS } from "@/constants/defaultitems";

describe("DefaultOptions", () => {
  it("should render each item in DEFAULT_ITEMS & their Links", () => {
    render(<DefaultOptions />);
    DEFAULT_ITEMS.forEach((item) => {
      const link = screen.getByRole("link", { name: item.title });
      expect(link).toHaveAttribute("href", item.path);
      expect(link).toHaveTextContent(item.title);
    });
  });
});
