import type { Meta, StoryObj } from "@storybook/react";
import { V28Spinner } from "./V28Spinner";

const meta: Meta<typeof V28Spinner> = {
  title: "Design System/Atoms/V28Spinner",
  component: V28Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "muted"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof V28Spinner>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: "Buchungen werden geladen...",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <V28Spinner size="sm" label="Klein" />
      <V28Spinner size="md" label="Mittel" />
      <V28Spinner size="lg" label="Groß" />
      <V28Spinner size="xl" label="Extra Groß" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <V28Spinner variant="default" label="Default" />
      <V28Spinner variant="secondary" label="Secondary" />
      <V28Spinner variant="destructive" label="Destructive" />
      <V28Spinner variant="muted" label="Muted" />
    </div>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <div className="flex h-64 items-center justify-center rounded-lg border bg-background">
      <V28Spinner size="lg" label="Daten werden geladen..." />
    </div>
  ),
};
