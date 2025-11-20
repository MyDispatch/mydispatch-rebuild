/* ==================================================================================
   STORYBOOK: BULK ACTION BAR
   ================================================================================== */

import type { Meta, StoryObj } from "@storybook/react";
import { BulkActionBar } from "@/components/shared/BulkActionBar";
import { Mail, Download, Archive } from "lucide-react";

const meta: Meta<typeof BulkActionBar> = {
  title: "Shared/BulkActionBar",
  component: BulkActionBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BulkActionBar>;

export const SingleSelection: Story = {
  args: {
    selectedCount: 1,
    onClearSelection: () => console.log("Clear selection"),
    actions: [
      { label: "E-Mail senden", icon: Mail, onClick: () => console.log("Email") },
      { label: "Exportieren", icon: Download, onClick: () => console.log("Export") },
    ],
  },
};

export const MultipleSelection: Story = {
  args: {
    selectedCount: 5,
    onClearSelection: () => console.log("Clear selection"),
    actions: [
      { label: "E-Mail senden", icon: Mail, onClick: () => console.log("Email") },
      { label: "Exportieren", icon: Download, onClick: () => console.log("Export") },
      { label: "Archivieren", icon: Archive, onClick: () => console.log("Archive") },
    ],
  },
};
