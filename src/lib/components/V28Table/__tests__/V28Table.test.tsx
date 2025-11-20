import { render } from "@testing-library/react";
import { V28Table } from "../index";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

interface TestData {
  id: number;
  name: string;
  value: string;
}

const testColumns = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "value", header: "Value" },
];

const testData: TestData[] = [
  { id: 1, name: "Item 1", value: "Value 1" },
  { id: 2, name: "Item 2", value: "Value 2" },
];

describe("V28Table", () => {
  it("renders table headers", () => {
    const { getByText } = render(<V28Table columns={testColumns} data={testData} />);
    expect(getByText("ID")).toBeInTheDocument();
    expect(getByText("Name")).toBeInTheDocument();
    expect(getByText("Value")).toBeInTheDocument();
  });

  it("renders table data", () => {
    const { getByText } = render(<V28Table columns={testColumns} data={testData} />);
    expect(getByText("Item 1")).toBeInTheDocument();
    expect(getByText("Value 2")).toBeInTheDocument();
  });

  it("displays empty message when no data", () => {
    const { getByText } = render(
      <V28Table columns={testColumns} data={[]} emptyMessage="No items" />
    );
    expect(getByText("No items")).toBeInTheDocument();
  });

  it("renders custom cell content with render prop", () => {
    const customColumns = [
      {
        key: "name",
        header: "Custom",
        render: (item: TestData) => <span>Custom: {item.name}</span>,
      },
    ];

    const { getByText } = render(<V28Table columns={customColumns} data={testData} />);
    expect(getByText("Custom: Item 1")).toBeInTheDocument();
  });
});
