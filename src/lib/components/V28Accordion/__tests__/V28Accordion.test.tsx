import { render } from "@testing-library/react";
import { V28Accordion } from "../index";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("V28Accordion", () => {
  const mockItems = [
    { value: "item-1", trigger: "Item 1", content: <div>Content 1</div> },
    { value: "item-2", trigger: "Item 2", content: <div>Content 2</div> },
    { value: "item-3", trigger: "Item 3", content: <div>Content 3</div>, disabled: true },
  ];

  it("renders all accordion items", () => {
    const { getByText } = render(<V28Accordion items={mockItems} />);
    expect(getByText("Item 1")).toBeInTheDocument();
    expect(getByText("Item 2")).toBeInTheDocument();
    expect(getByText("Item 3")).toBeInTheDocument();
  });

  it("handles disabled items", () => {
    const { getByText } = render(<V28Accordion items={mockItems} />);
    const disabledTrigger = getByText("Item 3").closest("button");
    expect(disabledTrigger).toBeDisabled();
  });

  it("supports single type accordion", () => {
    const { container } = render(<V28Accordion items={mockItems} type="single" />);
    expect(container.querySelector('[data-orientation="vertical"]')).toBeInTheDocument();
  });

  it("supports multiple type accordion", () => {
    const { container } = render(<V28Accordion items={mockItems} type="multiple" />);
    expect(container.querySelector('[data-orientation="vertical"]')).toBeInTheDocument();
  });
});
