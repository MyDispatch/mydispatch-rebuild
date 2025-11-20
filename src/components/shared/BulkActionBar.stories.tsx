import type { Meta, StoryObj } from "@storybook/react";
import { BulkActionBar } from "./BulkActionBar";
import { Download, Mail, Trash, Archive, Send } from "lucide-react";

const meta: Meta<typeof BulkActionBar> = {
  title: "Shared/BulkActionBar",
  component: BulkActionBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BulkActionBar>;

export const NoSelection: Story = {
  args: {
    selectedCount: 0,
    onClearSelection: () => console.log("Clear"),
    actions: [],
  },
};

export const SingleSelection: Story = {
  args: {
    selectedCount: 1,
    onClearSelection: () => console.log("Clear"),
    actions: [
      { label: "Export PDF", icon: Download, onClick: () => console.log("Export") },
      { label: "Send Email", icon: Mail, onClick: () => console.log("Email") },
    ],
  },
};

export const MultipleSelection: Story = {
  args: {
    selectedCount: 5,
    onClearSelection: () => console.log("Clear"),
    actions: [
      { label: "Export PDF", icon: Download, onClick: () => console.log("Export") },
      { label: "Send Email", icon: Mail, onClick: () => console.log("Email") },
      { label: "Archive", icon: Archive, onClick: () => console.log("Archive") },
    ],
  },
};

export const ManyActions: Story = {
  args: {
    selectedCount: 12,
    onClearSelection: () => console.log("Clear"),
    actions: [
      { label: "Export PDF", icon: Download, onClick: () => console.log("Export") },
      { label: "Send Email", icon: Mail, onClick: () => console.log("Email") },
      { label: "Send Reminder", icon: Send, onClick: () => console.log("Reminder") },
      { label: "Archive", icon: Archive, onClick: () => console.log("Archive") },
      { label: "Delete", icon: Trash, onClick: () => console.log("Delete") },
    ],
  },
};

export const LargeSelection: Story = {
  args: {
    selectedCount: 127,
    onClearSelection: () => console.log("Clear"),
    actions: [
      { label: "Export All", icon: Download, onClick: () => console.log("Export All") },
      { label: "Bulk Email", icon: Mail, onClick: () => console.log("Bulk Email") },
    ],
  },
};
