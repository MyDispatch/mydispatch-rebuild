/* ==================================================================================
   STORYBOOK: STANDARD ACTION BUTTONS
   ================================================================================== */

import type { Meta, StoryObj } from "@storybook/react";
import { StandardActionButtons } from "@/components/shared/StandardActionButtons";

const meta: Meta<typeof StandardActionButtons> = {
  title: "Shared/StandardActionButtons",
  component: StandardActionButtons,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StandardActionButtons>;

export const ViewAndEdit: Story = {
  args: {
    onViewDetails: () => console.log("View clicked"),
    onEdit: () => console.log("Edit clicked"),
  },
};

export const ViewOnly: Story = {
  args: {
    onViewDetails: () => console.log("View clicked"),
  },
};

export const EditOnly: Story = {
  args: {
    onEdit: () => console.log("Edit clicked"),
  },
};

export const WithArchive: Story = {
  args: {
    onViewDetails: () => console.log("View clicked"),
    onEdit: () => console.log("Edit clicked"),
    onArchive: () => console.log("Archive clicked"),
  },
};
