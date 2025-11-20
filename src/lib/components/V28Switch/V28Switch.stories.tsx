import type { Meta, StoryObj } from "@storybook/react";
import { V28Switch } from "./index";

const meta: Meta<typeof V28Switch> = {
  title: "Design System/V28Switch",
  component: V28Switch,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof V28Switch>;

export const Default: Story = {
  args: {
    label: "Enable notifications",
  },
};

export const Checked: Story = {
  args: {
    label: "Dark mode",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled switch",
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    defaultChecked: false,
  },
};
