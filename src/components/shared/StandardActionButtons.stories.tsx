/* ==================================================================================
   STANDARD ACTION BUTTONS STORIES - STORYBOOK V1.0
   ==================================================================================
   Stories for the StandardActionButtons component
   ================================================================================== */

import type { Meta, StoryObj } from "@storybook/react";
import { StandardActionButtons } from "./StandardActionButtons";

const meta: Meta<typeof StandardActionButtons> = {
  title: "Shared/StandardActionButtons",
  component: StandardActionButtons,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StandardActionButtons>;

// All Actions
export const AllActions: Story = {
  args: {
    onViewDetails: () => console.log("View details clicked"),
    onEdit: () => console.log("Edit clicked"),
    onArchive: () => console.log("Archive clicked"),
    showViewDetails: true,
    showEdit: true,
    showArchive: true,
  },
};

// View Only
export const ViewOnly: Story = {
  args: {
    onViewDetails: () => console.log("View details clicked"),
    showViewDetails: true,
    showEdit: false,
    showArchive: false,
  },
};

// View and Edit
export const ViewAndEdit: Story = {
  args: {
    onViewDetails: () => console.log("View details clicked"),
    onEdit: () => console.log("Edit clicked"),
    showViewDetails: true,
    showEdit: true,
    showArchive: false,
  },
};

// With Delete Instead of Archive
export const WithDelete: Story = {
  args: {
    onViewDetails: () => console.log("View details clicked"),
    onEdit: () => console.log("Edit clicked"),
    onDelete: () => console.log("Delete clicked"),
    showViewDetails: true,
    showEdit: true,
    showArchive: false,
    showDelete: true,
  },
};

// Small Size
export const SmallSize: Story = {
  args: {
    onViewDetails: () => console.log("View details clicked"),
    onEdit: () => console.log("Edit clicked"),
    onArchive: () => console.log("Archive clicked"),
    showViewDetails: true,
    showEdit: true,
    showArchive: true,
    size: "sm",
  },
};

// Large Size
export const LargeSize: Story = {
  args: {
    onViewDetails: () => console.log("View details clicked"),
    onEdit: () => console.log("Edit clicked"),
    onArchive: () => console.log("Archive clicked"),
    showViewDetails: true,
    showEdit: true,
    showArchive: true,
    size: "lg",
  },
};

// Icon Size
export const IconSize: Story = {
  args: {
    onViewDetails: () => console.log("View details clicked"),
    onEdit: () => console.log("Edit clicked"),
    onArchive: () => console.log("Archive clicked"),
    showViewDetails: true,
    showEdit: true,
    showArchive: true,
    size: "icon",
  },
};
