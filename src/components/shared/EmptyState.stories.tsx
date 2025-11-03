import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { FileText, Users, Car, Inbox } from 'lucide-react';

const meta: Meta<typeof EmptyState> = {
  title: 'Shared/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoData: Story = {
  args: {
    icon: <FileText className="w-full h-full" />,
    title: 'No invoices yet',
    description: 'Create your first invoice to get started',
  },
};

export const SearchNoResults: Story = {
  args: {
    icon: <Users className="w-full h-full" />,
    title: 'No customers found',
    description: 'Try adjusting your search criteria',
    isSearchResult: true,
  },
};

export const EmptyInbox: Story = {
  args: {
    icon: <Inbox className="w-full h-full" />,
    title: 'All caught up!',
    description: 'You have no pending tasks',
  },
};

export const NoVehicles: Story = {
  args: {
    icon: <Car className="w-full h-full" />,
    title: 'No vehicles available',
    description: 'Add vehicles to your fleet to start managing them',
  },
};

export const LongDescription: Story = {
  args: {
    icon: <FileText className="w-full h-full" />,
    title: 'No data available',
    description:
      'There is currently no data to display. This could be because you haven\'t created any items yet, or the filters you\'ve applied don\'t match any existing records. Try creating new items or adjusting your search criteria.',
  },
};
