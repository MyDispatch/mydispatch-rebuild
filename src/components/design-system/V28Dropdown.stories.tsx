import type { Meta, StoryObj } from "@storybook/react";
import { V28Dropdown } from "./V28Dropdown";
import { V28Button } from "./V28Button";
import { Edit, Trash2, Eye, Copy, Download, MoreVertical } from "lucide-react";
import { useState } from "react";

const meta: Meta<typeof V28Dropdown> = {
  title: "Design System/Atoms/V28Dropdown",
  component: V28Dropdown,
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof V28Dropdown>;

export const Default: Story = {
  args: {
    items: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
      { label: "Option 3", value: "opt3" },
    ],
    children: <V28Button variant="secondary">Optionen</V28Button>,
  },
};

export const WithIcons: Story = {
  render: () => {
    const [lastAction, setLastAction] = useState("");

    return (
      <div className="space-y-4">
        <V28Dropdown
          items={[
            {
              label: "Bearbeiten",
              value: "edit",
              icon: <Edit className="h-4 w-4" />,
              onSelect: () => setLastAction("Bearbeiten ausgewählt"),
            },
            {
              label: "Ansehen",
              value: "view",
              icon: <Eye className="h-4 w-4" />,
              onSelect: () => setLastAction("Ansehen ausgewählt"),
            },
            {
              label: "Kopieren",
              value: "copy",
              icon: <Copy className="h-4 w-4" />,
              onSelect: () => setLastAction("Kopieren ausgewählt"),
            },
            {
              label: "Löschen",
              value: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              onSelect: () => setLastAction("Löschen ausgewählt"),
            },
          ]}
        >
          <V28Button variant="secondary" icon={MoreVertical}>
            Aktionen
          </V28Button>
        </V28Dropdown>
        {lastAction && <p className="text-sm text-muted-foreground">Letzte Aktion: {lastAction}</p>}
      </div>
    );
  },
};

export const BookingActions: Story = {
  render: () => (
    <V28Dropdown
      items={[
        {
          label: "Details anzeigen",
          value: "view",
          icon: <Eye className="h-4 w-4" />,
        },
        {
          label: "Buchung bearbeiten",
          value: "edit",
          icon: <Edit className="h-4 w-4" />,
        },
        {
          label: "Rechnung herunterladen",
          value: "download",
          icon: <Download className="h-4 w-4" />,
        },
        {
          label: "Buchung stornieren",
          value: "delete",
          icon: <Trash2 className="h-4 w-4" />,
        },
      ]}
    >
      <V28Button variant="ghost" icon={MoreVertical} size="sm" />
    </V28Dropdown>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <V28Dropdown
      items={[
        { label: "Verfügbar", value: "available" },
        { label: "Deaktiviert", value: "disabled", disabled: true },
        { label: "Aktiv", value: "active" },
      ]}
    >
      <V28Button variant="secondary">Status auswählen</V28Button>
    </V28Dropdown>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8 p-12">
      <V28Dropdown
        items={[
          { label: "Option 1", value: "opt1" },
          { label: "Option 2", value: "opt2" },
        ]}
        side="left"
      >
        <V28Button variant="secondary">Links</V28Button>
      </V28Dropdown>

      <V28Dropdown
        items={[
          { label: "Option 1", value: "opt1" },
          { label: "Option 2", value: "opt2" },
        ]}
        side="top"
      >
        <V28Button variant="secondary">Oben</V28Button>
      </V28Dropdown>

      <V28Dropdown
        items={[
          { label: "Option 1", value: "opt1" },
          { label: "Option 2", value: "opt2" },
        ]}
        side="bottom"
      >
        <V28Button variant="secondary">Unten</V28Button>
      </V28Dropdown>

      <V28Dropdown
        items={[
          { label: "Option 1", value: "opt1" },
          { label: "Option 2", value: "opt2" },
        ]}
        side="right"
      >
        <V28Button variant="secondary">Rechts</V28Button>
      </V28Dropdown>
    </div>
  ),
};
