import type { Meta, StoryObj } from '@storybook/react';
import { V28Sheet } from './index';
import { useState } from 'react';
import { V28Button } from '@/components/design-system/V28Button';

const meta: Meta<typeof V28Sheet> = {
  title: 'Design System/V28Sheet',
  component: V28Sheet,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof V28Sheet>;

export const RightSide: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button variant="primary" onClick={() => setOpen(true)}>Open Right Sheet</V28Button>
        <V28Sheet
          open={open}
          onOpenChange={setOpen}
          title="Settings"
          description="Configure your preferences"
          side="right"
        >
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Profile Settings</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Manage your profile information</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Notifications</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Control notification preferences</p>
            </div>
          </div>
        </V28Sheet>
      </>
    );
  },
};

export const LeftSide: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button variant="primary" onClick={() => setOpen(true)}>Open Left Sheet</V28Button>
        <V28Sheet open={open} onOpenChange={setOpen} title="Navigation Menu" side="left">
          <nav className="space-y-2 py-4">
            <a href="#" className="block px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              Dashboard
            </a>
            <a href="#" className="block px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              Orders
            </a>
            <a href="#" className="block px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              Drivers
            </a>
          </nav>
        </V28Sheet>
      </>
    );
  },
};

export const BottomSheet: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button variant="primary" onClick={() => setOpen(true)}>Open Bottom Sheet</V28Button>
        <V28Sheet open={open} onOpenChange={setOpen} title="Quick Actions" side="bottom">
          <div className="grid grid-cols-3 gap-4 py-4">
            <V28Button variant="secondary">Action 1</V28Button>
            <V28Button variant="secondary">Action 2</V28Button>
            <V28Button variant="secondary">Action 3</V28Button>
          </div>
        </V28Sheet>
      </>
    );
  },
};
