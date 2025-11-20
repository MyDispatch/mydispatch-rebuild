import type { Meta, StoryObj } from "@storybook/react";
import { V28Tooltip } from "./index";
import { V28Button } from "@/components/design-system/V28Button";
import { Info, HelpCircle } from "lucide-react";

const meta: Meta<typeof V28Tooltip> = {
  title: "Design System/V28Tooltip",
  component: V28Tooltip,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof V28Tooltip>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center p-12">
      <V28Tooltip content="This is helpful information">
        <V28Button variant="secondary">Hover me</V28Button>
      </V28Tooltip>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center gap-12 p-12">
      <V28Tooltip content="Top tooltip" side="top">
        <V28Button variant="primary">Top</V28Button>
      </V28Tooltip>
      <div className="flex gap-12">
        <V28Tooltip content="Left tooltip" side="left">
          <V28Button variant="primary">Left</V28Button>
        </V28Tooltip>
        <V28Tooltip content="Right tooltip" side="right">
          <V28Button variant="primary">Right</V28Button>
        </V28Tooltip>
      </div>
      <V28Tooltip content="Bottom tooltip" side="bottom">
        <V28Button variant="primary">Bottom</V28Button>
      </V28Tooltip>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-12">
      <V28Tooltip content="More information available">
        <Info className="h-5 w-5 text-slate-600 dark:text-slate-400 cursor-help" />
      </V28Tooltip>
      <V28Tooltip content="Click for help documentation">
        <HelpCircle className="h-5 w-5 text-slate-600 dark:text-slate-400 cursor-help" />
      </V28Tooltip>
    </div>
  ),
};

export const ComplexContent: Story = {
  render: () => (
    <div className="flex items-center justify-center p-12">
      <V28Tooltip
        content={
          <div className="space-y-1">
            <p className="font-semibold">Feature Details</p>
            <p className="text-xs">This feature includes:</p>
            <ul className="text-xs list-disc pl-4">
              <li>Real-time updates</li>
              <li>Dark mode support</li>
            </ul>
          </div>
        }
      >
        <V28Button variant="secondary">Complex Tooltip</V28Button>
      </V28Tooltip>
    </div>
  ),
};
