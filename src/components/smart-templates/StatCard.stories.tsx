import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "./StatCard";
import { Users, Car, Euro, TrendingUp, Activity } from "lucide-react";

const meta: Meta<typeof StatCard> = {
  title: "Smart Templates/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const SimpleValue: Story = {
  args: {
    label: "Total Bookings",
    value: 127,
    icon: Users,
  },
};

export const CurrencyValue: Story = {
  args: {
    label: "Monthly Revenue",
    value: "€12,450.00",
    icon: Euro,
  },
};

export const WithPositiveTrend: Story = {
  args: {
    label: "Active Drivers",
    value: 24,
    icon: Users,
    change: {
      value: 12,
      trend: "up" as const,
    },
  },
};

export const WithNegativeTrend: Story = {
  args: {
    label: "Pending Orders",
    value: 8,
    icon: Activity,
    change: {
      value: -15,
      trend: "down" as const,
    },
  },
};

export const WithChange: Story = {
  args: {
    label: "Available Vehicles",
    value: 18,
    icon: Car,
    change: {
      value: 3,
      trend: "up" as const,
    },
  },
};

export const LargeNumbers: Story = {
  args: {
    label: "Total Revenue",
    value: "€1,234,567.89",
    icon: Euro,
    change: {
      value: 23,
      trend: "up" as const,
    },
  },
};

export const ZeroValue: Story = {
  args: {
    label: "Overdue Invoices",
    value: 0,
    icon: Euro,
  },
};

export const LongLabel: Story = {
  args: {
    label: "Average Customer Satisfaction Score This Month",
    value: "4.8/5.0",
    icon: TrendingUp,
  },
};
