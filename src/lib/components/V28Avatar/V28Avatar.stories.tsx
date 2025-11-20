import type { Meta, StoryObj } from "@storybook/react";
import { V28Avatar } from "./index";

const meta: Meta<typeof V28Avatar> = {
  title: "Design System/V28Avatar",
  component: V28Avatar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof V28Avatar>;

export const Default: Story = {
  args: {
    fallback: "AB",
  },
};

export const WithImage: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    alt: "User Avatar",
    fallback: "UN",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <V28Avatar size="sm" fallback="S" />
      <V28Avatar size="md" fallback="M" />
      <V28Avatar size="lg" fallback="L" />
      <V28Avatar size="xl" fallback="XL" />
    </div>
  ),
};

export const FallbackVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <V28Avatar fallback="AB" />
      <V28Avatar fallback="CD" />
      <V28Avatar fallback="EF" />
      <V28Avatar fallback="GH" />
    </div>
  ),
};

export const WithBrokenImage: Story = {
  args: {
    src: "https://invalid-url.com/broken.jpg",
    fallback: "ER",
    alt: "Broken Image",
  },
};
