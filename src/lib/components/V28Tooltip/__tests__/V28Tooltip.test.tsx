import { render } from "@testing-library/react";
import { V28Tooltip } from "../index";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("V28Tooltip", () => {
  it("renders trigger element", () => {
    const { getByText } = render(
      <V28Tooltip content="Tooltip text">
        <button>Hover me</button>
      </V28Tooltip>
    );
    expect(getByText("Hover me")).toBeInTheDocument();
  });

  it("accepts string content", () => {
    const { container } = render(
      <V28Tooltip content="Helpful hint">
        <button>Button</button>
      </V28Tooltip>
    );
    expect(container).toBeInTheDocument();
  });

  it("accepts ReactNode content", () => {
    const { container } = render(
      <V28Tooltip
        content={
          <span>
            Complex <strong>content</strong>
          </span>
        }
      >
        <button>Button</button>
      </V28Tooltip>
    );
    expect(container).toBeInTheDocument();
  });
});
