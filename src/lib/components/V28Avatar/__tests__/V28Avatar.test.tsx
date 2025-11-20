import { render } from "@testing-library/react";
import { V28Avatar } from "../index";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("V28Avatar", () => {
  it("renders with default props", () => {
    const { container } = render(<V28Avatar />);
    expect(container.querySelector("[data-radix-collection-item]")).toBeInTheDocument();
  });

  it("renders fallback text", () => {
    const { getByText } = render(<V28Avatar fallback="JD" />);
    expect(getByText("JD")).toBeInTheDocument();
  });

  it("applies size variants correctly", () => {
    const { container, rerender } = render(<V28Avatar size="sm" />);
    expect(container.querySelector(".h-8")).toBeInTheDocument();

    rerender(<V28Avatar size="xl" />);
    expect(container.querySelector(".h-16")).toBeInTheDocument();
  });

  it("renders image when src provided", () => {
    const { container } = render(
      <V28Avatar src="https://example.com/avatar.jpg" alt="Test User" />
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(img).toHaveAttribute("alt", "Test User");
  });
});
