import { render } from "@testing-library/react";
import { V28Sheet } from "../index";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("V28Sheet", () => {
  it("renders when open", () => {
    const { getByText } = render(
      <V28Sheet open={true} onOpenChange={() => {}}>
        <div>Sheet Content</div>
      </V28Sheet>
    );
    expect(getByText("Sheet Content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const { queryByText } = render(
      <V28Sheet open={false} onOpenChange={() => {}}>
        <div>Sheet Content</div>
      </V28Sheet>
    );
    expect(queryByText("Sheet Content")).not.toBeInTheDocument();
  });

  it("renders title and description", () => {
    const { getByText } = render(
      <V28Sheet
        open={true}
        onOpenChange={() => {}}
        title="Sheet Title"
        description="Sheet Description"
      >
        <div>Content</div>
      </V28Sheet>
    );
    expect(getByText("Sheet Title")).toBeInTheDocument();
    expect(getByText("Sheet Description")).toBeInTheDocument();
  });

  it("applies side variants correctly", () => {
    const { container, rerender } = render(
      <V28Sheet open={true} onOpenChange={() => {}} side="left">
        <div>Content</div>
      </V28Sheet>
    );
    expect(container.querySelector(".left-0")).toBeInTheDocument();

    rerender(
      <V28Sheet open={true} onOpenChange={() => {}} side="bottom">
        <div>Content</div>
      </V28Sheet>
    );
    expect(container.querySelector(".bottom-0")).toBeInTheDocument();
  });
});
