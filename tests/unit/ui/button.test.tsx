import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Button } from "../../../nexify-new-complete/components/ui/button";

describe("Button", () => {
  it("renders with default variant", () => {
    const { getByRole } = render(<Button>Click</Button>);
    expect(getByRole("button")).toBeDefined();
  });
});
