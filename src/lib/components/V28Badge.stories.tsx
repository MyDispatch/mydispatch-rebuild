import type { Meta, StoryObj } from '@storybook/react';
import { V28Badge } from './V28Badge';

const meta: Meta<typeof V28Badge> = {
  title: 'Design System/V28Badge',
  component: V28Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof V28Badge>;

export const Success: Story = {
  args: {
    label: 'Success',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    label: 'Warning',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    label: 'Error',
    variant: 'error',
  },
};

export const Info: Story = {
  args: {
    label: 'Info',
    variant: 'info',
  },
};

export const Neutral: Story = {
  args: {
    label: 'Neutral',
    variant: 'neutral',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <V28Badge label="Success" variant="success" />
      <V28Badge label="Warning" variant="warning" />
      <V28Badge label="Error" variant="error" />
      <V28Badge label="Info" variant="info" />
      <V28Badge label="Neutral" variant="neutral" />
    </div>
  ),
};

export const LongText: Story = {
  args: {
    label: 'This is a longer badge text',
    variant: 'info',
  },
};

export const DarkMode: Story = {
  args: {
    label: 'Dark Mode Badge',
    variant: 'success',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
