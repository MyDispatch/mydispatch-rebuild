/**
 * V28Input Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import { V28Input } from "./V28Input";

const meta = {
  title: "Design System/Atoms/V28Input",
  component: V28Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    error: { control: "text" },
    helperText: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
} satisfies Meta<typeof V28Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Text eingeben...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "E-Mail-Adresse",
    placeholder: "max@example.com",
    type: "email",
  },
};

export const Required: Story = {
  args: {
    label: "Pflichtfeld",
    placeholder: "Muss ausgefüllt werden",
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: "E-Mail-Adresse",
    placeholder: "max@example.com",
    value: "ungueltige-email",
    error: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Benutzername",
    placeholder: "max_mustermann",
    helperText: "Mindestens 3 Zeichen, nur Buchstaben und Unterstriche",
  },
};

export const Disabled: Story = {
  args: {
    label: "Deaktiviert",
    placeholder: "Nicht editierbar",
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    label: "Passwort",
    type: "password",
    placeholder: "••••••••",
  },
};
