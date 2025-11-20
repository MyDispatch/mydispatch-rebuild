import type { Meta, StoryObj } from '@storybook/react';
import { V28Tooltip } from './V28Tooltip';
import { V28Button } from './V28Button';
import { Info, HelpCircle } from 'lucide-react';

const meta: Meta<typeof V28Tooltip> = {
  title: 'Design System/Atoms/V28Tooltip',
  component: V28Tooltip,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof V28Tooltip>;

export const Default: Story = {
  args: {
    content: 'Dies ist ein Tooltip',
    children: <V28Button variant="secondary">Hover mich</V28Button>,
  },
};

export const WithIcon: Story = {
  render: () => (
    <V28Tooltip content="Weitere Informationen zur Buchung">
      <button className="inline-flex items-center gap-2">
        Buchungsinfo <Info className="h-4 w-4 text-muted-foreground" />
      </button>
    </V28Tooltip>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8 p-12">
      <V28Tooltip content="Tooltip oben" side="top">
        <V28Button variant="secondary">Oben</V28Button>
      </V28Tooltip>
      <div className="flex gap-8">
        <V28Tooltip content="Tooltip links" side="left">
          <V28Button variant="secondary">Links</V28Button>
        </V28Tooltip>
        <V28Tooltip content="Tooltip rechts" side="right">
          <V28Button variant="secondary">Rechts</V28Button>
        </V28Tooltip>
      </div>
      <V28Tooltip content="Tooltip unten" side="bottom">
        <V28Button variant="secondary">Unten</V28Button>
      </V28Tooltip>
    </div>
  ),
};

export const HelpText: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span>Fahrzeugtyp</span>
      <V28Tooltip content="Wählen Sie den passenden Fahrzeugtyp für Ihre Buchung aus. Standard (bis 4 Personen), Van (bis 8 Personen), Bus (bis 50 Personen)">
        <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
      </V28Tooltip>
    </div>
  ),
};

export const ComplexContent: Story = {
  render: () => (
    <V28Tooltip
      content={
        <div className="space-y-1">
          <p className="font-semibold">Buchungsdetails</p>
          <p className="text-xs">Datum: 15.02.2024</p>
          <p className="text-xs">Uhrzeit: 14:30</p>
          <p className="text-xs">Status: Bestätigt</p>
        </div>
      }
    >
      <V28Button variant="secondary">Details anzeigen</V28Button>
    </V28Tooltip>
  ),
};
