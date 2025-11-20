import type { Meta, StoryObj } from "@storybook/react";
import { V28Tabs } from "./index";

const meta: Meta<typeof V28Tabs> = {
  title: "Design System/V28Tabs",
  component: V28Tabs,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof V28Tabs>;

export const Default: Story = {
  args: {
    tabs: [
      {
        value: "overview",
        label: "Overview",
        content: (
          <div className="p-4 text-slate-700 dark:text-slate-300">
            <h3 className="text-lg font-semibold mb-2">Overview</h3>
            <p>General information and statistics about your project.</p>
          </div>
        ),
      },
      {
        value: "analytics",
        label: "Analytics",
        content: (
          <div className="p-4 text-slate-700 dark:text-slate-300">
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p>Detailed analytics and performance metrics.</p>
          </div>
        ),
      },
      {
        value: "settings",
        label: "Settings",
        content: (
          <div className="p-4 text-slate-700 dark:text-slate-300">
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p>Configure your preferences and options.</p>
          </div>
        ),
      },
    ],
  },
};

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      {
        value: "active",
        label: "Active",
        content: <div className="p-4">Active tab content</div>,
      },
      {
        value: "disabled",
        label: "Disabled",
        content: <div className="p-4">This content is not accessible</div>,
        disabled: true,
      },
      {
        value: "another",
        label: "Another",
        content: <div className="p-4">Another tab content</div>,
      },
    ],
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      { value: "1", label: "Dashboard", content: <div className="p-4">Dashboard</div> },
      { value: "2", label: "Orders", content: <div className="p-4">Orders</div> },
      { value: "3", label: "Drivers", content: <div className="p-4">Drivers</div> },
      { value: "4", label: "Analytics", content: <div className="p-4">Analytics</div> },
      { value: "5", label: "Settings", content: <div className="p-4">Settings</div> },
    ],
  },
};
