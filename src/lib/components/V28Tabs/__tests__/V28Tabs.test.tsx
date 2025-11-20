import { render } from "@testing-library/react";
import { V28Tabs } from "../index";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("V28Tabs", () => {
  const mockTabs = [
    { value: "tab1", label: "Tab 1", content: <div>Content 1</div> },
    { value: "tab2", label: "Tab 2", content: <div>Content 2</div> },
    { value: "tab3", label: "Tab 3", content: <div>Content 3</div>, disabled: true },
  ];

  it("renders all tab labels", () => {
    const { getByText } = render(<V28Tabs tabs={mockTabs} />);
    expect(getByText("Tab 1")).toBeInTheDocument();
    expect(getByText("Tab 2")).toBeInTheDocument();
    expect(getByText("Tab 3")).toBeInTheDocument();
  });

  it("renders default tab content", () => {
    const { getByText } = render(<V28Tabs tabs={mockTabs} defaultValue="tab1" />);
    expect(getByText("Content 1")).toBeInTheDocument();
  });

  it("handles disabled tabs", () => {
    const { getByText } = render(<V28Tabs tabs={mockTabs} />);
    const disabledTab = getByText("Tab 3").closest("button");
    expect(disabledTab).toBeDisabled();
  });
});
