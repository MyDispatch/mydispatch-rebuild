import type { Meta, StoryObj } from '@storybook/react';
import { StatusIndicator } from './StatusIndicator';

const meta: Meta<typeof StatusIndicator> = {
  title: 'Shared/StatusIndicator',
  component: StatusIndicator,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'warning', 'error', 'neutral', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusIndicator>;

export const Success: Story = {
  args: {
    type: 'success',
    label: 'Completed',
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    label: 'Pending',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    label: 'Failed',
  },
};

export const Neutral: Story = {
  args: {
    type: 'neutral',
    label: 'Draft',
  },
};

export const Info: Story = {
  args: {
    type: 'info',
    label: 'In Progress',
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <StatusIndicator type="success" label="Success" />
      <StatusIndicator type="warning" label="Warning" />
      <StatusIndicator type="error" label="Error" />
      <StatusIndicator type="neutral" label="Neutral" />
      <StatusIndicator type="info" label="Info" />
    </div>
  ),
};
