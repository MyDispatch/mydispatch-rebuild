/**
 * V28Checkbox Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { V28Checkbox } from './V28Checkbox';

const meta = {
  title: 'Design System/Atoms/V28Checkbox',
  component: V28Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof V28Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Ich akzeptiere die Nutzungsbedingungen',
  },
};

export const Checked: Story = {
  args: {
    label: 'Newsletter abonnieren',
    checked: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Marketing-E-Mails erhalten',
    description: 'Wir senden Ihnen regelmäßig Angebote und Neuigkeiten zu',
  },
};

export const Required: Story = {
  args: {
    label: 'Datenschutzerklärung akzeptieren',
    description: 'Zur Nutzung des Dienstes erforderlich',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'AGB akzeptieren',
    error: 'Sie müssen die AGB akzeptieren, um fortzufahren',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Deaktivierte Option',
    description: 'Diese Option ist zurzeit nicht verfügbar',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Bereits akzeptiert',
    description: 'Diese Einstellung kann nicht mehr geändert werden',
    checked: true,
    disabled: true,
  },
};

export const LongText: Story = {
  args: {
    label: 'Ich habe die Datenschutzerklärung gelesen und verstanden',
    description: 'Ihre Daten werden gemäß der Datenschutz-Grundverordnung (DSGVO) verarbeitet. Sie haben jederzeit das Recht auf Auskunft, Berichtigung und Löschung Ihrer personenbezogenen Daten.',
  },
};
