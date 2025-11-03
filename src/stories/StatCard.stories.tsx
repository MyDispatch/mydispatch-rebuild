/* ==================================================================================
   STORYBOOK: STAT CARD
   ================================================================================== */

import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from '@/components/smart-templates/StatCard';
import { TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';

const meta: Meta<typeof StatCard> = {
  title: 'Components/StatCard',
  component: StatCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const WithIncrease: Story = {
  args: {
    label: 'Heutige Aufträge',
    value: 12,
    icon: Users,
    change: { value: 8, trend: 'up' },
  },
};

export const WithDecrease: Story = {
  args: {
    label: 'Offene Aufträge',
    value: 5,
    icon: TrendingDown,
    change: { value: 15, trend: 'down' },
  },
};

export const WithCurrency: Story = {
  args: {
    label: 'Umsatz Heute',
    value: '2.450 €',
    icon: DollarSign,
    change: { value: 12, trend: 'up' },
  },
};

export const NoTrend: Story = {
  args: {
    label: 'Verfügbare Fahrer',
    value: 8,
    icon: Users,
  },
};

export const LongLabel: Story = {
  args: {
    label: 'Durchschnittliche Bearbeitungszeit pro Auftrag',
    value: '45 Min',
    icon: TrendingUp,
    change: { value: 5, trend: 'up' },
  },
};

export const HighValue: Story = {
  args: {
    label: 'Gesamt Kunden',
    value: 1247,
    icon: Users,
    change: { value: 23, trend: 'up' },
  },
};
