import type { Meta, StoryObj } from '@storybook/react';
import { V28Popover } from './V28Popover';
import { V28Button } from './V28Button';
import { Calendar, Settings } from 'lucide-react';

const meta: Meta<typeof V28Popover> = {
  title: 'Design System/Atoms/V28Popover',
  component: V28Popover,
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
type Story = StoryObj<typeof V28Popover>;

export const Default: Story = {
  args: {
    content: (
      <div className="space-y-2">
        <p className="text-sm font-medium">Buchungsoptionen</p>
        <p className="text-xs text-muted-foreground">
          Wählen Sie die gewünschten Optionen für Ihre Buchung aus.
        </p>
      </div>
    ),
    children: <V28Button variant="secondary">Optionen öffnen</V28Button>,
  },
};

export const WithList: Story = {
  render: () => (
    <V28Popover
      content={
        <div className="space-y-2">
          <p className="text-sm font-medium">Schnellaktionen</p>
          <div className="space-y-1">
            <button className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent">
              Neue Buchung
            </button>
            <button className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent">
              Fahrer hinzufügen
            </button>
            <button className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent">
              Fahrzeug hinzufügen
            </button>
          </div>
        </div>
      }
    >
      <V28Button variant="secondary">Aktionen</V28Button>
    </V28Popover>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8 p-12">
      <V28Popover
        content={<p className="text-sm">Inhalt links</p>}
        side="left"
      >
        <V28Button variant="secondary">Links</V28Button>
      </V28Popover>

      <V28Popover
        content={<p className="text-sm">Inhalt oben</p>}
        side="top"
      >
        <V28Button variant="secondary">Oben</V28Button>
      </V28Popover>

      <V28Popover
        content={<p className="text-sm">Inhalt unten</p>}
        side="bottom"
      >
        <V28Button variant="secondary">Unten</V28Button>
      </V28Popover>

      <V28Popover
        content={<p className="text-sm">Inhalt rechts</p>}
        side="right"
      >
        <V28Button variant="secondary">Rechts</V28Button>
      </V28Popover>
    </div>
  ),
};

export const FilterOptions: Story = {
  render: () => (
    <V28Popover
      content={
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Status</label>
            <select className="mt-1 w-full rounded border px-2 py-1 text-sm">
              <option>Alle</option>
              <option>Bestätigt</option>
              <option>Ausstehend</option>
              <option>Storniert</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Zeitraum</label>
            <input
              type="date"
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
            />
          </div>
          <V28Button size="sm" fullWidth>
            Filter anwenden
          </V28Button>
        </div>
      }
    >
      <V28Button variant="secondary" icon={Settings}>
        Filter
      </V28Button>
    </V28Popover>
  ),
};

export const CalendarPicker: Story = {
  render: () => (
    <V28Popover
      content={
        <div className="space-y-2">
          <p className="text-sm font-medium">Datum auswählen</p>
          <div className="space-y-1">
            <button className="w-full rounded px-2 py-1 text-left text-sm hover:bg-accent">
              Heute
            </button>
            <button className="w-full rounded px-2 py-1 text-left text-sm hover:bg-accent">
              Morgen
            </button>
            <button className="w-full rounded px-2 py-1 text-left text-sm hover:bg-accent">
              Nächste Woche
            </button>
            <div className="border-t pt-1">
              <button className="w-full rounded px-2 py-1 text-left text-sm hover:bg-accent">
                Benutzerdefiniert...
              </button>
            </div>
          </div>
        </div>
      }
    >
      <V28Button variant="secondary" icon={Calendar}>
        Datum wählen
      </V28Button>
    </V28Popover>
  ),
};
