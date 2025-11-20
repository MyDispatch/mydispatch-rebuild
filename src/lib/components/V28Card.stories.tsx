import type { Meta, StoryObj } from "@storybook/react";
import { V28Card } from "./V28Card";
import { Users, Settings, FileText } from "lucide-react";

const meta: Meta<typeof V28Card> = {
  title: "Design System/V28Card",
  component: V28Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "hover", "selected"],
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof V28Card>;

export const Default: Story = {
  args: {
    title: "Card Title",
    description: "This is a default card with some content inside.",
  },
};

export const WithIcon: Story = {
  args: {
    title: "Users",
    description: "Manage user accounts and permissions",
    icon: Users,
  },
};

export const HoverVariant: Story = {
  args: {
    title: "Hover Card",
    description: "This card has hover effects",
    variant: "hover",
    icon: Settings,
  },
};

export const SelectedVariant: Story = {
  args: {
    title: "Selected Card",
    description: "This card appears selected",
    variant: "selected",
    icon: FileText,
  },
};

export const Interactive: Story = {
  args: {
    title: "Clickable Card",
    description: "Click this card to see interaction",
    icon: Users,
    onClick: () => alert("Card clicked!"),
  },
};

export const WithChildren: Story = {
  args: {
    title: "Custom Content",
    description: "Card with additional custom content",
    children: (
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Status</span>
          <span className="font-medium text-green-600">Active</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Last updated</span>
          <span className="font-medium">2 hours ago</span>
        </div>
      </div>
    ),
  },
};

export const OnlyChildren: Story = {
  args: {
    children: (
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Custom Card</h3>
        <p className="text-slate-600">This card only has children content</p>
      </div>
    ),
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-4xl">
      <V28Card title="Users" description="123 active users" icon={Users} variant="hover" />
      <V28Card
        title="Settings"
        description="System configuration"
        icon={Settings}
        variant="hover"
      />
      <V28Card title="Documents" description="45 files" icon={FileText} variant="hover" />
    </div>
  ),
};
