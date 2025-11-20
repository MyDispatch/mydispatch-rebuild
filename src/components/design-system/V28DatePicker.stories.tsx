import type { Meta, StoryObj } from '@storybook/react';
import { V28DatePicker } from './V28DatePicker';
import { useState } from 'react';

const meta: Meta<typeof V28DatePicker> = {
  title: 'Design System/Atoms/V28DatePicker',
  component: V28DatePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof V28DatePicker>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return <V28DatePicker value={date} onChange={setDate} />;
  },
};

export const WithLabel: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <V28DatePicker
        label="Abholdatum"
        value={date}
        onChange={setDate}
        placeholder="Bitte wählen Sie ein Datum"
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <V28DatePicker
        label="Buchungsdatum"
        value={date}
        onChange={setDate}
        error="Bitte wählen Sie ein Datum aus"
      />
    );
  },
};

export const PreSelected: Story = {
  render: () => {
    const [date, setDate] = useState<Date>(new Date());
    return (
      <V28DatePicker
        label="Startdatum"
        value={date}
        onChange={setDate}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <V28DatePicker
        label="Gesperrt"
        value={date}
        onChange={setDate}
        disabled
      />
    );
  },
};

export const BookingForm: Story = {
  render: () => {
    const [pickupDate, setPickupDate] = useState<Date>();
    const [returnDate, setReturnDate] = useState<Date>();
    
    return (
      <div className="max-w-md space-y-4 rounded-lg border p-6">
        <h3 className="text-lg font-semibold">Neue Buchung</h3>
        <V28DatePicker
          label="Abholung"
          value={pickupDate}
          onChange={setPickupDate}
          placeholder="Abholdatum wählen"
        />
        <V28DatePicker
          label="Rückgabe"
          value={returnDate}
          onChange={setReturnDate}
          placeholder="Rückgabedatum wählen"
        />
        {pickupDate && returnDate && (
          <p className="text-sm text-muted-foreground">
            Dauer: {Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))} Tage
          </p>
        )}
      </div>
    );
  },
};

export const MultipleFields: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [reminderDate, setReminderDate] = useState<Date>();
    
    return (
      <div className="grid max-w-2xl gap-4">
        <V28DatePicker
          label="Startdatum"
          value={startDate}
          onChange={setStartDate}
        />
        <V28DatePicker
          label="Enddatum"
          value={endDate}
          onChange={setEndDate}
        />
        <V28DatePicker
          label="Erinnerung"
          value={reminderDate}
          onChange={setReminderDate}
        />
      </div>
    );
  },
};
