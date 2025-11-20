/* ==================================================================================
   STORYBOOK: RELATED ENTITY CARD
   ================================================================================== */

import type { Meta, StoryObj } from "@storybook/react";
import { RelatedEntityCard } from "@/components/shared/RelatedEntityCard";

const meta: Meta<typeof RelatedEntityCard> = {
  title: "Shared/RelatedEntityCard",
  component: RelatedEntityCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RelatedEntityCard>;

export const Booking: Story = {
  args: {
    type: "customer",
    label: "Auftrag",
    value: "Berlin Hauptbahnhof → Flughafen BER",
    meta: "Preis: 45,00 € | Status: abgeschlossen",
    onClick: () => console.log("Booking clicked"),
  },
};

export const Invoice: Story = {
  args: {
    type: "invoice",
    label: "Rechnung",
    value: "RE-12345678",
    meta: "Betrag: 150,00 €",
    status: "error",
    statusLabel: "Überfällig",
    onClick: () => console.log("Invoice clicked"),
  },
};

export const Customer: Story = {
  args: {
    type: "customer",
    label: "Kunde",
    value: "Max Mustermann",
    meta: "Letzte Buchung: 15.03.2024",
    onClick: () => console.log("Customer clicked"),
  },
};
