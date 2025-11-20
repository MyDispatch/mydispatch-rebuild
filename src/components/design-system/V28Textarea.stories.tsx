/**
 * V28Textarea Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import { V28Textarea } from "./V28Textarea";

const meta = {
  title: "Design System/Atoms/V28Textarea",
  component: V28Textarea,
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
    showCharacterCount: { control: "boolean" },
  },
} satisfies Meta<typeof V28Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Text eingeben...",
    rows: 4,
  },
};

export const WithLabel: Story = {
  args: {
    label: "Nachricht",
    placeholder: "Ihre Nachricht an uns...",
    rows: 4,
  },
};

export const Required: Story = {
  args: {
    label: "Beschreibung",
    placeholder: "Pflichtfeld",
    required: true,
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    label: "Kommentar",
    value: "Zu kurz",
    error: "Mindestens 10 Zeichen erforderlich",
    rows: 4,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Notizen",
    placeholder: "Interne Notizen...",
    helperText: "Diese Notizen sind nur für interne Zwecke sichtbar",
    rows: 4,
  },
};

export const WithCharacterCount: Story = {
  args: {
    label: "Kurzbeschreibung",
    placeholder: "Max. 200 Zeichen",
    showCharacterCount: true,
    maxLength: 200,
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    label: "Deaktiviert",
    value: "Dieser Text kann nicht bearbeitet werden",
    disabled: true,
    rows: 4,
  },
};

export const LongText: Story = {
  args: {
    label: "Ausführliche Beschreibung",
    placeholder: "Geben Sie eine ausführliche Beschreibung ein...",
    rows: 8,
    showCharacterCount: true,
    maxLength: 1000,
  },
};
