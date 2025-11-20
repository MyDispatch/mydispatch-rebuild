import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { V28Select } from "../V28Select";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

describe("V28Select", () => {
  it("renders options correctly", () => {
    const { container } = render(<V28Select options={options} value="" onChange={() => {}} />);
    const select = container.querySelector("select");
    const optionElements = select?.querySelectorAll("option");
    expect(optionElements?.length).toBe(3);
  });

  it("renders placeholder when provided", () => {
    const { container } = render(
      <V28Select options={options} placeholder="Select..." value="" onChange={() => {}} />
    );
    const select = container.querySelector("select");
    const placeholderOption = select?.querySelector("option[disabled]");
    expect(placeholderOption?.textContent).toBe("Select...");
  });

  it("renders label when provided", () => {
    const { container } = render(
      <V28Select label="Country" options={options} value="" onChange={() => {}} />
    );
    const label = container.querySelector("label");
    expect(label?.textContent).toBe("Country");
  });

  it("renders error message when provided", () => {
    const { container } = render(
      <V28Select options={options} error="Required field" value="" onChange={() => {}} />
    );
    expect(container.textContent).toContain("Required field");
  });

  it("applies error styles when error is present", () => {
    const { container } = render(
      <V28Select options={options} error="Error" value="" onChange={() => {}} />
    );
    const select = container.querySelector("select");
    expect(select?.className).toContain("border-red-500");
  });

  it("handles value change", () => {
    const onChange = vi.fn();
    const { container } = render(<V28Select options={options} value="" onChange={onChange} />);
    const select = container.querySelector("select") as HTMLSelectElement;

    select.value = "2";
    const event = new Event("change", { bubbles: true });
    select.dispatchEvent(event);
    expect(onChange).toHaveBeenCalledWith("2");
  });

  it("handles disabled state", () => {
    const { container } = render(
      <V28Select options={options} value="" onChange={() => {}} disabled />
    );
    const select = container.querySelector("select");
    expect(select?.disabled).toBe(true);
    expect(select?.className).toContain("disabled:cursor-not-allowed");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null as HTMLSelectElement | null };
    render(<V28Select ref={ref} options={options} value="" onChange={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it("accepts custom className", () => {
    const { container } = render(
      <V28Select options={options} value="" onChange={() => {}} className="custom-class" />
    );
    const select = container.querySelector("select");
    expect(select?.className).toContain("custom-class");
  });

  it("renders chevron icon", () => {
    const { container } = render(<V28Select options={options} value="" onChange={() => {}} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("generates unique id when not provided", () => {
    const { container } = render(<V28Select options={options} value="" onChange={() => {}} />);
    const select = container.querySelector("select");
    expect(select?.id).toBeTruthy();
    expect(select?.id).toMatch(/^select-/);
  });

  it("uses provided id", () => {
    const { container } = render(
      <V28Select id="custom-id" options={options} value="" onChange={() => {}} />
    );
    const select = container.querySelector("select");
    expect(select?.id).toBe("custom-id");
  });

  it("sets controlled value", () => {
    const { container } = render(<V28Select options={options} value="2" onChange={() => {}} />);
    const select = container.querySelector("select") as HTMLSelectElement;
    expect(select.value).toBe("2");
  });
});
