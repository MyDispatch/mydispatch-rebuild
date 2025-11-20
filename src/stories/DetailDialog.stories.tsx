/* ==================================================================================
   STORYBOOK: DETAIL DIALOG
   ================================================================================== */

import type { Meta, StoryObj } from "@storybook/react";
import { DetailDialog } from "@/components/shared/DetailDialog";

const meta: Meta<typeof DetailDialog> = {
  title: "Shared/DetailDialog",
  component: DetailDialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DetailDialog>;

export const CustomerDetails: Story = {
  args: {
    open: true,
    onOpenChange: (open: boolean) => console.log("Dialog state:", open),
    title: "Kunden-Details",
    createdAt: new Date().toISOString(),
    onEdit: () => console.log("Edit clicked"),
    onArchive: async () => console.log("Archive clicked"),
    children: (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">Max Mustermann</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">E-Mail</p>
          <p className="font-medium">max@example.com</p>
        </div>
      </div>
    ),
  },
};

export const DriverDetails: Story = {
  args: {
    open: true,
    onOpenChange: (open: boolean) => console.log("Dialog state:", open),
    title: "Fahrer-Details",
    createdAt: new Date().toISOString(),
    onEdit: () => console.log("Edit clicked"),
    onArchive: async () => console.log("Archive clicked"),
    children: (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Führerscheinnummer</p>
          <p className="font-medium">DE123456789</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="font-medium">Verfügbar</p>
        </div>
      </div>
    ),
  },
};
