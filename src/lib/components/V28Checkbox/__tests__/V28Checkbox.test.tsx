import { render } from "@testing-library/react";
import { V28Checkbox } from "../index";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("V28Checkbox", () => {
  it("renders without label", () => {
    const { container } = render(<V28Checkbox />);
    const checkbox = container.querySelector('button[role="checkbox"]');
    expect(checkbox).toBeInTheDocument();
  });

  it("renders with label", () => {
    const { getByText } = render(<V28Checkbox label="Test Label" />);
    expect(getByText("Test Label")).toBeInTheDocument();
  });

  it("supports checked state", () => {
    const { container } = render(<V28Checkbox label="Test" defaultChecked />);
    const checkbox = container.querySelector('button[role="checkbox"]');
    expect(checkbox).toHaveAttribute("data-state", "checked");
  });

  it("supports disabled state", () => {
    const { container } = render(<V28Checkbox label="Test" disabled />);
    const checkbox = container.querySelector('button[role="checkbox"]');
    expect(checkbox).toBeDisabled();
  });
});
