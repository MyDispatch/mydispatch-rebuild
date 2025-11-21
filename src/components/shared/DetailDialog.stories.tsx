/* ==================================================================================
   DETAIL DIALOG STORIES - STORYBOOK V1.0
   ==================================================================================
   Stories for the unified DetailDialog component
   ================================================================================== */

import type { Meta, StoryObj } from '@storybook/react';
import { DetailDialog } from './DetailDialog';
import { Users, Car, FileText } from 'lucide-react';

const meta: Meta<typeof DetailDialog> = {
  title: 'Shared/DetailDialog',
  component: DetailDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DetailDialog>;

// Basic Detail Dialog
export const CustomerDetail: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    title: 'Kunden-Details',
    createdAt: '2025-01-28T10:00:00Z',
    onEdit: () => console.log('Edit clicked'),
    onArchive: async () => {
      console.log('Archive clicked');
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    children: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">Max Mustermann</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">E-Mail</p>
            <p className="font-medium">max@example.com</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Telefon</p>
            <p className="font-medium">+49 123 456789</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">Aktiv</p>
          </div>
        </div>
      </div>
    ),
  },
};

// With Related Entities
export const DriverDetailWithRelated: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    title: 'Fahrer-Details',
    createdAt: '2025-01-15T08:30:00Z',
    onEdit: () => console.log('Edit clicked'),
    onArchive: async () => {
      console.log('Archive clicked');
    },
    children: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">John Doe</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Führerschein</p>
            <p className="font-medium">DE-12345678</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Telefon</p>
            <p className="font-medium">+49 987 654321</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium text-success-text">Verfügbar</p>
          </div>
        </div>
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2">Verknüpfte Aufträge</h4>
          <div className="space-y-2">
            <div className="p-2 bg-muted rounded">
              <p className="text-sm">Auftrag #12345</p>
              <p className="text-xs text-muted-foreground">Berlin → München | 450 €</p>
            </div>
            <div className="p-2 bg-muted rounded">
              <p className="text-sm">Auftrag #12346</p>
              <p className="text-xs text-muted-foreground">Hamburg → Frankfurt | 320 €</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
};

// Vehicle Detail
export const VehicleDetail: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    title: 'Fahrzeug-Details',
    createdAt: '2025-01-10T12:00:00Z',
    onEdit: () => console.log('Edit clicked'),
    onDelete: async () => {
      console.log('Delete clicked');
    },
    showArchive: false,
    showDelete: true,
    children: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Kennzeichen</p>
            <p className="font-medium">B-MY 1234</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Marke</p>
            <p className="font-medium">Mercedes-Benz</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Modell</p>
            <p className="font-medium">E-Klasse</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium text-success-text">Verfügbar</p>
          </div>
        </div>
      </div>
    ),
  },
};

// Invoice Detail
export const InvoiceDetail: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    title: 'Rechnungs-Details',
    createdAt: '2025-01-20T14:30:00Z',
    onEdit: () => console.log('Edit clicked'),
    onArchive: async () => {
      console.log('Archive clicked');
    },
    children: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Rechnungsnummer</p>
            <p className="font-medium">RE-2025-001</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Kunde</p>
            <p className="font-medium">ABC GmbH</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Betrag</p>
            <p className="font-medium text-lg">1.250,00 €</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium text-warning-text">Ausstehend</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Fälligkeitsdatum</p>
            <p className="font-medium">15.02.2025</p>
          </div>
        </div>
      </div>
    ),
  },
};
