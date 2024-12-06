import DefaultOptions from "@/components/ui/defaultoptions";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

// Mock data for testing
const DEFAULT_ITEMS = [
  { _id: "1", title: "Project 1" },
  { _id: "2", title: "Project 2" },
];

describe("DefaultOptions", () => {
  it("should render each item in DEFAULT_ITEMS with Links containing tokens", () => {
    // Pass the mock data as the defaultOptions prop
    render(<DefaultOptions defaultOptions={DEFAULT_ITEMS} />);

    // Check each item is rendered with correct attributes and token in the query string
    DEFAULT_ITEMS.forEach((item) => {
      const link = screen.getByRole("link", { name: item.title });

      // Verify the href includes the token as a query parameter
      expect(link).toHaveAttribute(
        "href",
        `/dashboard/${item.title}/${item.title}?token=${item._id}`,
      );

      // Check the link text content
      expect(link).toHaveTextContent(item.title);
    });
  });

  it("should display 'No projects available.' when defaultOptions is empty", () => {
    // Render with an empty defaultOptions array
    render(<DefaultOptions defaultOptions={[]} />);
    expect(screen.getByText("No projects available.")).toBeInTheDocument();
  });
});
