/* ==================================================================================
   STORYBOOK: EMPTY STATE
   ================================================================================== */

import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Users, FileText } from "lucide-react";

const meta: Meta<typeof EmptyState> = {
  title: "Shared/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoData: Story = {
  args: {
    icon: <Users className="w-full h-full" />,
    title: "Noch keine Kunden",
    description: "Legen Sie Ihren ersten Kunden an",
    actionLabel: "Kunde anlegen",
    onAction: () => console.log("Create customer"),
  },
};

export const SearchResult: Story = {
  args: {
    icon: <FileText className="w-full h-full" />,
    title: "Keine Ergebnisse gefunden",
    description: "Versuchen Sie einen anderen Suchbegriff",
    isSearchResult: true,
  },
};

export const WithoutAction: Story = {
  args: {
    icon: <Users className="w-full h-full" />,
    title: "Keine Daten vorhanden",
    description: "Es gibt derzeit keine Daten anzuzeigen",
  },
};
