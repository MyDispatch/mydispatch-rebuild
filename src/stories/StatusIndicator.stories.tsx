/* ==================================================================================
   STORYBOOK: STATUS INDICATOR
   ================================================================================== */

import type { Meta, StoryObj } from "@storybook/react";
import { StatusIndicator } from "@/components/shared/StatusIndicator";

const meta: Meta<typeof StatusIndicator> = {
  title: "Shared/StatusIndicator",
  component: StatusIndicator,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatusIndicator>;

export const Success: Story = {
  args: {
    type: "success",
    label: "Abgeschlossen",
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
    label: "Ausstehend",
  },
};

export const Error: Story = {
  args: {
    type: "error",
    label: "Überfällig",
  },
};

export const Neutral: Story = {
  args: {
    type: "neutral",
    label: "Deaktiviert",
  },
};

export const Info: Story = {
  args: {
    type: "info",
    label: "In Bearbeitung",
  },
};
