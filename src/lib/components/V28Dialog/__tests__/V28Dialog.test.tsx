import { render } from "@testing-library/react";
import { V28Dialog } from "../index";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("V28Dialog", () => {
  it("renders when open", () => {
    const { getByText } = render(
      <V28Dialog open={true} onOpenChange={() => {}}>
        <div>Dialog Content</div>
      </V28Dialog>
    );
    expect(getByText("Dialog Content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const { queryByText } = render(
      <V28Dialog open={false} onOpenChange={() => {}}>
        <div>Dialog Content</div>
      </V28Dialog>
    );
    expect(queryByText("Dialog Content")).not.toBeInTheDocument();
  });

  it("renders title when provided", () => {
    const { getByText } = render(
      <V28Dialog open={true} onOpenChange={() => {}} title="Test Title">
        <div>Content</div>
      </V28Dialog>
    );
    expect(getByText("Test Title")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    const { getByText } = render(
      <V28Dialog open={true} onOpenChange={() => {}} description="Test Description">
        <div>Content</div>
      </V28Dialog>
    );
    expect(getByText("Test Description")).toBeInTheDocument();
  });
});
