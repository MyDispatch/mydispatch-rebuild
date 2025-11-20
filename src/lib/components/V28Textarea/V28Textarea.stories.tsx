import type { Meta, StoryObj } from "@storybook/react";
import { V28Textarea } from "./index";

const meta: Meta<typeof V28Textarea> = {
  title: "Design System/V28Textarea",
  component: V28Textarea,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    rows: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof V28Textarea>;

export const Default: Story = {
  args: {
    label: "Description",
    placeholder: "Enter your description here...",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Comments",
    placeholder: "Add your comments...",
    helperText: "Max 500 characters",
  },
};

export const WithError: Story = {
  args: {
    label: "Message",
    placeholder: "Enter message",
    error: "Message is required",
    defaultValue: "",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Field",
    disabled: true,
    defaultValue: "This field is disabled",
  },
};

export const CustomRows: Story = {
  args: {
    label: "Long Form",
    rows: 8,
    placeholder: "Enter detailed information...",
  },
};
