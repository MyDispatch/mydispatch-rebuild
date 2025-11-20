import type { Meta, StoryObj } from "@storybook/react";
import { V28Modal } from "./V28Modal";
import { V28Button } from "./V28Button";
import { useState } from "react";

const meta: Meta<typeof V28Modal> = {
  title: "Design System/Atoms/V28Modal",
  component: V28Modal,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof V28Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button onClick={() => setOpen(true)}>Modal öffnen</V28Button>
        <V28Modal open={open} onOpenChange={setOpen} title="Modal Titel">
          <div className="space-y-4">
            <p>Dies ist der Modal-Inhalt.</p>
            <div className="flex justify-end gap-2">
              <V28Button variant="secondary" onClick={() => setOpen(false)}>
                Abbrechen
              </V28Button>
              <V28Button variant="primary" onClick={() => setOpen(false)}>
                Bestätigen
              </V28Button>
            </div>
          </div>
        </V28Modal>
      </>
    );
  },
};

export const WithDescription: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button onClick={() => setOpen(true)}>Mit Beschreibung</V28Button>
        <V28Modal
          open={open}
          onOpenChange={setOpen}
          title="Buchung löschen"
          description="Sind Sie sicher, dass Sie diese Buchung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        >
          <div className="flex justify-end gap-2 mt-4">
            <V28Button variant="secondary" onClick={() => setOpen(false)}>
              Abbrechen
            </V28Button>
            <V28Button variant="destructive" onClick={() => setOpen(false)}>
              Löschen
            </V28Button>
          </div>
        </V28Modal>
      </>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<"sm" | "md" | "lg" | "xl" | "full">("md");
    const [open, setOpen] = useState(false);

    return (
      <>
        <div className="flex gap-2">
          <V28Button
            onClick={() => {
              setSize("sm");
              setOpen(true);
            }}
          >
            Klein
          </V28Button>
          <V28Button
            onClick={() => {
              setSize("md");
              setOpen(true);
            }}
          >
            Mittel
          </V28Button>
          <V28Button
            onClick={() => {
              setSize("lg");
              setOpen(true);
            }}
          >
            Groß
          </V28Button>
          <V28Button
            onClick={() => {
              setSize("xl");
              setOpen(true);
            }}
          >
            Extra Groß
          </V28Button>
          <V28Button
            onClick={() => {
              setSize("full");
              setOpen(true);
            }}
          >
            Vollbild
          </V28Button>
        </div>
        <V28Modal
          open={open}
          onOpenChange={setOpen}
          title={`Modal - ${size.toUpperCase()}`}
          size={size}
        >
          <p>Dies ist ein Modal in Größe: {size}</p>
          <V28Button onClick={() => setOpen(false)} className="mt-4">
            Schließen
          </V28Button>
        </V28Modal>
      </>
    );
  },
};

export const FormModal: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button onClick={() => setOpen(true)}>Neue Buchung</V28Button>
        <V28Modal
          open={open}
          onOpenChange={setOpen}
          title="Neue Buchung erstellen"
          description="Füllen Sie die Details für die neue Buchung aus"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Kunde</label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border p-2"
                placeholder="Kundenname eingeben"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Abholort</label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border p-2"
                placeholder="Adresse eingeben"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Datum</label>
              <input type="date" className="mt-1 w-full rounded-md border p-2" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <V28Button variant="secondary" onClick={() => setOpen(false)}>
                Abbrechen
              </V28Button>
              <V28Button variant="primary" onClick={() => setOpen(false)}>
                Speichern
              </V28Button>
            </div>
          </div>
        </V28Modal>
      </>
    );
  },
};
