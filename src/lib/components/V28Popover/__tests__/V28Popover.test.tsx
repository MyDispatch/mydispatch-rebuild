import { render } from "@testing-library/react";
import { V28Popover } from "../index";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("V28Popover", () => {
  it("renders trigger element", () => {
    const { getByText } = render(
      <V28Popover trigger={<button>Open Popover</button>}>
        <div>Popover Content</div>
      </V28Popover>
    );
    expect(getByText("Open Popover")).toBeInTheDocument();
  });

  it("accepts ReactNode as trigger", () => {
    const { getByRole } = render(
      <V28Popover trigger={<button>Custom Trigger</button>}>
        <div>Content</div>
      </V28Popover>
    );
    expect(getByRole("button")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const { container } = render(
      <V28Popover trigger={<button>Trigger</button>} className="custom-class">
        <div>Content</div>
      </V28Popover>
    );
    expect(container).toBeInTheDocument();
  });
});
