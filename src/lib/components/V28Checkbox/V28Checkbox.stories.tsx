import type { Meta, StoryObj } from "@storybook/react";
import { V28Checkbox } from "./index";

const meta: Meta<typeof V28Checkbox> = {
  title: "Design System/V28Checkbox",
  component: V28Checkbox,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof V28Checkbox>;

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
  },
};

export const Checked: Story = {
  args: {
    label: "Email notifications",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled checkbox",
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    defaultChecked: false,
  },
};
