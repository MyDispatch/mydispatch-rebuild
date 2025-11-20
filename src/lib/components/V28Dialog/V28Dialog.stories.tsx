import type { Meta, StoryObj } from '@storybook/react';
import { V28Dialog } from './index';
import { useState } from 'react';
import { V28Button } from '@/components/design-system/V28Button';

const meta: Meta<typeof V28Dialog> = {
  title: 'Design System/V28Dialog',
  component: V28Dialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof V28Dialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button variant="primary" onClick={() => setOpen(true)}>Open Dialog</V28Button>
        <V28Dialog
          open={open}
          onOpenChange={setOpen}
          title="Dialog Title"
          description="This is a dialog description"
        >
          <div className="py-4">
            <p className="text-sm text-slate-600">Dialog content goes here.</p>
          </div>
          <div className="flex justify-end gap-2">
            <V28Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </V28Button>
            <V28Button variant="primary" onClick={() => setOpen(false)}>
              Confirm
            </V28Button>
          </div>
        </V28Dialog>
      </>
    );
  },
};

export const WithoutDescription: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button variant="primary" onClick={() => setOpen(true)}>Open Simple Dialog</V28Button>
        <V28Dialog open={open} onOpenChange={setOpen} title="Confirmation">
          <div className="py-4">
            <p className="text-sm text-slate-600">Are you sure you want to proceed?</p>
          </div>
          <div className="flex justify-end gap-2">
            <V28Button variant="secondary" onClick={() => setOpen(false)}>
              No
            </V28Button>
            <V28Button variant="primary" onClick={() => setOpen(false)}>
              Yes
            </V28Button>
          </div>
        </V28Dialog>
      </>
    );
  },
};
