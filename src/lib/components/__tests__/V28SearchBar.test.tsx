import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { V28SearchBar } from "../V28SearchBar";

describe("V28SearchBar", () => {
  it("renders with value", () => {
    const { container } = render(<V28SearchBar value="test" onChange={() => {}} />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("test");
  });

  it("renders with placeholder", () => {
    const { container } = render(
      <V28SearchBar value="" onChange={() => {}} placeholder="Search here" />
    );
    const input = container.querySelector("input");
    expect(input?.placeholder).toBe("Search here");
  });

  it("uses default placeholder", () => {
    const { container } = render(<V28SearchBar value="" onChange={() => {}} />);
    const input = container.querySelector("input");
    expect(input?.placeholder).toBe("Suchen...");
  });

  it("calls onChange when typing", () => {
    const onChange = vi.fn();
    const { container } = render(<V28SearchBar value="" onChange={onChange} />);
    const input = container.querySelector("input") as HTMLInputElement;

    input.value = "test query";
    const event = new Event("change", { bubbles: true });
    input.dispatchEvent(event);
    expect(onChange).toHaveBeenCalledWith("test query");
  });

  it("renders search icon", () => {
    const { container } = render(<V28SearchBar value="" onChange={() => {}} />);
    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("renders clear button when value is present", () => {
    const { container } = render(<V28SearchBar value="test" onChange={() => {}} />);
    const button = container.querySelector("button");
    expect(button).toBeTruthy();
  });

  it("does not render clear button when value is empty", () => {
    const { container } = render(<V28SearchBar value="" onChange={() => {}} />);
    const button = container.querySelector("button");
    expect(button).toBeFalsy();
  });

  it("clears value when clear button is clicked", () => {
    const onChange = vi.fn();
    const { container } = render(<V28SearchBar value="test" onChange={onChange} />);
    const button = container.querySelector("button");

    button!.click();
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("calls onClear callback when clear button is clicked", () => {
    const onClear = vi.fn();
    const { container } = render(
      <V28SearchBar value="test" onChange={() => {}} onClear={onClear} />
    );
    const button = container.querySelector("button");

    button!.click();
    expect(onClear).toHaveBeenCalled();
  });

  it("handles disabled state", () => {
    const { container } = render(<V28SearchBar value="" onChange={() => {}} disabled />);
    const input = container.querySelector("input");
    expect(input?.disabled).toBe(true);
  });

  it("forwards ref correctly", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<V28SearchBar ref={ref} value="" onChange={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("accepts custom className", () => {
    const { container } = render(
      <V28SearchBar value="" onChange={() => {}} className="custom-class" />
    );
    const input = container.querySelector("input");
    expect(input?.className).toContain("custom-class");
  });
});
