/* ==================================================================================
   RELATED ENTITY CARD STORIES - STORYBOOK V1.0
   ==================================================================================
   Stories for the RelatedEntityCard component
   ================================================================================== */

import type { Meta, StoryObj } from "@storybook/react";
import { RelatedEntityCard } from "./RelatedEntityCard";

const meta: Meta<typeof RelatedEntityCard> = {
  title: "Shared/RelatedEntityCard",
  component: RelatedEntityCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RelatedEntityCard>;

// Customer Card
export const CustomerCard: Story = {
  args: {
    type: "customer",
    label: "Kunde",
    value: "Max Mustermann",
    meta: "max@example.com | +49 123 456789",
    onClick: () => console.log("Customer clicked"),
  },
};

// Driver Card with Status
export const DriverCard: Story = {
  args: {
    type: "driver",
    label: "Fahrer",
    value: "John Doe",
    meta: "Führerschein: DE-12345678",
    status: "success",
    statusLabel: "Verfügbar",
    onClick: () => console.log("Driver clicked"),
  },
};

// Vehicle Card
export const VehicleCard: Story = {
  args: {
    type: "vehicle",
    label: "Fahrzeug",
    value: "B-MY 1234",
    meta: "Mercedes-Benz E-Klasse | Economy Class",
    status: "warning",
    statusLabel: "In Wartung",
    onClick: () => console.log("Vehicle clicked"),
  },
};

// Invoice Card
export const InvoiceCard: Story = {
  args: {
    type: "invoice",
    label: "Rechnung",
    value: "RE-2025-001",
    meta: "Betrag: 1.250,00 € | Fällig: 15.02.2025",
    status: "error",
    statusLabel: "Überfällig",
    onClick: () => console.log("Invoice clicked"),
  },
};

// Partner Card
export const PartnerCard: Story = {
  args: {
    type: "partner",
    label: "Partner",
    value: "ABC Taxi GmbH",
    meta: "Provision: 15% | Status: Aktiv",
    status: "success",
    statusLabel: "Aktiv",
    onClick: () => console.log("Partner clicked"),
  },
};

// Booking Card
export const BookingCard: Story = {
  args: {
    type: "customer", // Using customer type for booking representation
    label: "Auftrag",
    value: "BK-2025-001",
    meta: "Berlin → München | Kunde: Max Mustermann",
    status: "neutral",
    statusLabel: "Ausstehend",
    onClick: () => console.log("Booking clicked"),
  },
};

// Card with Location
export const CardWithLocation: Story = {
  args: {
    type: "driver",
    label: "Fahrer",
    value: "John Doe",
    meta: "Führerschein: DE-12345678 | Standort: Berlin",
    status: "success",
    statusLabel: "Verfügbar",
    location: {
      latitude: 52.520008,
      longitude: 13.404954,
    },
    onClick: () => console.log("Driver clicked"),
  },
};
