---
to: src/components/<%= category %>/<%= name %>.stories.tsx
---
import type { Meta, StoryObj } from '@storybook/react';
import { <%= name %> } from './<%= name %>';

const meta: Meta<typeof <%= name %>> = {
  title: '<%= category %>/<%= name %>',
  component: <%= name %>,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof <%= name %>>;

export const Default: Story = {
  args: {
    children: 'Default <%= name %>',
  },
};
