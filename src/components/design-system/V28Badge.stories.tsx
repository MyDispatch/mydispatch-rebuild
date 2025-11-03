import type { Meta, StoryObj } from '@storybook/react';
import { V28Badge } from './V28Badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const meta: Meta<typeof V28Badge> = {
  title: 'Design System/Atoms/V28Badge',
  component: V28Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof V28Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const BookingStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <V28Badge variant="primary">Bestätigt</V28Badge>
      <V28Badge variant="secondary">Ausstehend</V28Badge>
      <V28Badge variant="primary">Neu</V28Badge>
      <V28Badge variant="secondary">Archiviert</V28Badge>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <V28Badge variant="primary">Primary</V28Badge>
      <V28Badge variant="secondary">Secondary</V28Badge>
    </div>
  ),
};

export const CustomStyles: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <V28Badge variant="primary">Standard</V28Badge>
      <V28Badge variant="secondary">Alternative</V28Badge>
      <V28Badge variant="primary" className="bg-green-100 border-green-300 text-green-800">Erfolgreich</V28Badge>
      <V28Badge variant="secondary" className="bg-red-100 border-red-300 text-red-800">Fehler</V28Badge>
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <V28Badge variant="primary">3 Buchungen</V28Badge>
      <V28Badge variant="secondary">Neu</V28Badge>
      <V28Badge variant="primary">14:30 Uhr</V28Badge>
    </div>
  ),
};
