import type { Meta, StoryObj } from '@storybook/react';
import { V28Button } from './V28Button';
import { Plus, Download, Mail } from 'lucide-react';

const meta: Meta<typeof V28Button> = {
  title: 'Design System/V28Button',
  component: V28Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof V28Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const SmallSize: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
  },
};

export const LargeSize: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: (
      <>
        <Plus className="h-4 w-4 mr-2" />
        Create New
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'secondary',
    size: 'sm',
    children: <Download className="h-4 w-4" />,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
};

export const LongText: Story = {
  args: {
    variant: 'primary',
    children: 'This is a very long button text to test wrapping behavior',
  },
};
