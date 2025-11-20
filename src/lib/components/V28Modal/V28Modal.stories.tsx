import type { Meta, StoryObj } from '@storybook/react';
import { V28Modal } from './index';
import { useState } from 'react';
import { V28Button } from '@/components/design-system/V28Button';

const meta: Meta<typeof V28Modal> = {
  title: 'Design System/V28Modal',
  component: V28Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof V28Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button variant="primary" onClick={() => setOpen(true)}>Open Modal</V28Button>
        <V28Modal
          open={open}
          onOpenChange={setOpen}
          title="Confirmation Required"
          description="This action cannot be undone. Are you sure?"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This will permanently delete your account and all associated data.
            </p>
            <div className="flex justify-end gap-3">
              <V28Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </V28Button>
              <V28Button variant="destructive" onClick={() => setOpen(false)}>
                Delete Account
              </V28Button>
            </div>
          </div>
        </V28Modal>
      </>
    );
  },
};

export const SmallSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button variant="primary" onClick={() => setOpen(true)}>Open Small Modal</V28Button>
        <V28Modal open={open} onOpenChange={setOpen} title="Quick Action" size="sm">
          <p className="text-sm text-slate-600 dark:text-slate-400">Compact modal for simple confirmations.</p>
          <V28Button variant="primary" onClick={() => setOpen(false)} className="w-full">Confirm</V28Button>
        </V28Modal>
      </>
    );
  },
};

export const FullScreen: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button variant="primary" onClick={() => setOpen(true)}>Open Full Modal</V28Button>
        <V28Modal open={open} onOpenChange={setOpen} title="Detailed Form" size="full">
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Full-width modal for complex forms and detailed content.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 dark:border-slate-700">Section 1</div>
              <div className="p-4 border border-slate-200 dark:border-slate-700">Section 2</div>
            </div>
          </div>
        </V28Modal>
      </>
    );
  },
};
