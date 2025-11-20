import type { Meta, StoryObj } from "@storybook/react";
import { V28Input } from "./V28Input";

const meta: Meta<typeof V28Input> = {
  title: "Design System/V28Input",
  component: V28Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof V28Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Email Address",
    placeholder: "you@example.com",
    type: "email",
  },
};

export const WithError: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username",
    error: "Username is required",
    defaultValue: "",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter password",
    helperText: "Password must be at least 8 characters",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Input",
    placeholder: "Cannot edit",
    disabled: true,
    defaultValue: "Read-only value",
  },
};

export const TypeEmail: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "name@example.com",
  },
};

export const TypePassword: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "••••••••",
  },
};

export const TypeNumber: Story = {
  args: {
    label: "Age",
    type: "number",
    placeholder: "0",
    min: 0,
    max: 150,
  },
};

export const DarkMode: Story = {
  args: {
    label: "Dark Mode Input",
    placeholder: "Type something...",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Form: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <V28Input label="Full Name" placeholder="John Doe" />
      <V28Input label="Email" type="email" placeholder="john@example.com" />
      <V28Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
      <V28Input
        label="Password"
        type="password"
        placeholder="••••••••"
        helperText="Must be at least 8 characters"
      />
    </div>
  ),
};
