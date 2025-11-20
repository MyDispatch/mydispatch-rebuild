import type { Meta, StoryObj } from "@storybook/react";
import { V28SearchBar } from "./V28SearchBar";
import { useState } from "react";

const meta: Meta<typeof V28SearchBar> = {
  title: "Design System/V28SearchBar",
  component: V28SearchBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof V28SearchBar>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return <V28SearchBar value={value} onChange={setValue} />;
  },
};

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState("example search");
    return <V28SearchBar value={value} onChange={setValue} />;
  },
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <V28SearchBar
        value={value}
        onChange={setValue}
        placeholder="Search bookings, drivers, or vehicles..."
      />
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [results, setResults] = useState<string[]>([]);

    const handleChange = (newValue: string) => {
      setValue(newValue);
      // Simulate search results
      if (newValue.length > 0) {
        setResults([
          `Result 1 for "${newValue}"`,
          `Result 2 for "${newValue}"`,
          `Result 3 for "${newValue}"`,
        ]);
      } else {
        setResults([]);
      }
    };

    return (
      <div className="w-96 space-y-4">
        <V28SearchBar value={value} onChange={handleChange} placeholder="Type to search..." />
        {results.length > 0 && (
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <p className="text-sm font-medium mb-2">Search Results:</p>
            <ul className="space-y-1">
              {results.map((result, idx) => (
                <li key={idx} className="text-sm text-slate-600">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
};

export const WithClearButton: Story = {
  render: () => {
    const [value, setValue] = useState("Click X to clear");
    return (
      <div className="w-96">
        <V28SearchBar value={value} onChange={setValue} onClear={() => console.log("Cleared!")} />
        <p className="text-xs text-slate-500 mt-2">The X button appears when there's text</p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState("Disabled search");
    return <V28SearchBar value={value} onChange={setValue} disabled />;
  },
};

export const DarkMode: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return <V28SearchBar value={value} onChange={setValue} />;
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const FullWidth: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="w-full max-w-2xl">
        <V28SearchBar value={value} onChange={setValue} placeholder="Full width search..." />
      </div>
    );
  },
};
