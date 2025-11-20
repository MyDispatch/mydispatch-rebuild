/* ==================================================================================
   STORYBOOK: PAGE HEADER WITH KPIs
   ================================================================================== */

import type { Meta, StoryObj } from "@storybook/react";
import {
  PageHeaderWithKPIs,
  type KPICardData,
  type QuickAction,
} from "@/components/shared/PageHeaderWithKPIs";
import { Users, DollarSign, TrendingUp, Plus, FileText } from "lucide-react";

const meta: Meta<typeof PageHeaderWithKPIs> = {
  title: "Shared/PageHeaderWithKPIs",
  component: PageHeaderWithKPIs,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageHeaderWithKPIs>;

const sampleKPIs: [KPICardData, KPICardData, KPICardData] = [
  {
    title: "Heutige Aufträge",
    value: 12,
    icon: Users,
    trend: { value: 8, label: "+8%" },
  },
  {
    title: "Umsatz Heute",
    value: "2.450 €",
    icon: DollarSign,
    trend: { value: 12, label: "+12%" },
  },
  {
    title: "Verfügbare Fahrer",
    value: 8,
    icon: TrendingUp,
  },
];

const sampleQuickActions: [QuickAction, QuickAction] = [
  {
    label: "Neuer Auftrag",
    icon: Plus,
    onClick: () => console.log("Neuer Auftrag"),
  },
  {
    label: "Schichtzettel",
    icon: FileText,
    onClick: () => console.log("Schichtzettel"),
  },
];

export const WithKPIsAndActions: Story = {
  args: {
    kpis: sampleKPIs,
    quickActions: sampleQuickActions,
  },
};
