import type { Meta, StoryObj } from "@storybook/react";
import { V28Radio } from "./V28Radio";

const meta: Meta<typeof V28Radio> = {
  title: "Design System/Atoms/V28Radio",
  component: V28Radio,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error"],
    },
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof V28Radio>;

const paymentOptions = [
  { value: "cash", label: "Barzahlung", description: "Zahlung direkt beim Fahrer" },
  { value: "invoice", label: "Rechnung", description: "Zahlung per Überweisung" },
  { value: "card", label: "Karte", description: "Zahlung mit Kreditkarte" },
];

export const Default: Story = {
  args: {
    name: "payment",
    options: paymentOptions,
  },
};

export const WithLabel: Story = {
  args: {
    name: "payment",
    label: "Zahlungsmethode",
    options: paymentOptions,
  },
};

export const Horizontal: Story = {
  args: {
    name: "payment",
    label: "Zahlungsmethode",
    options: paymentOptions,
    orientation: "horizontal",
  },
};

export const WithError: Story = {
  args: {
    name: "payment",
    label: "Zahlungsmethode",
    options: paymentOptions,
    error: "Bitte wählen Sie eine Zahlungsmethode",
  },
};

export const SimpleOptions: Story = {
  args: {
    name: "vehicle-status",
    label: "Fahrzeugstatus",
    options: [
      { value: "available", label: "Verfügbar" },
      { value: "busy", label: "Im Einsatz" },
      { value: "maintenance", label: "Wartung" },
    ],
    orientation: "horizontal",
  },
};
