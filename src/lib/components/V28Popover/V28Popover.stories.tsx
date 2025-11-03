import type { Meta, StoryObj } from '@storybook/react';
import { V28Popover } from './index';
import { V28Button } from '@/components/design-system/V28Button';
import { Settings, User, Bell } from 'lucide-react';

const meta: Meta<typeof V28Popover> = {
  title: 'Design System/V28Popover',
  component: V28Popover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof V28Popover>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center p-12">
      <V28Popover trigger={<V28Button variant="secondary">Open Popover</V28Button>}>
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100">Popover Title</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This is a popover with some helpful information.
          </p>
        </div>
      </V28Popover>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center justify-center p-12">
      <V28Popover
        trigger={
          <V28Button variant="ghost" size="sm" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </V28Button>
        }
      >
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Quick Settings</h4>
          <div className="space-y-2">
            <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
              Profile Settings
            </button>
            <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
              Preferences
            </button>
            <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
              Logout
            </button>
          </div>
        </div>
      </V28Popover>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center gap-12 p-12">
      <V28Popover trigger={<V28Button variant="primary">Top</V28Button>} side="top">
        <p className="text-sm">Popover positioned on top</p>
      </V28Popover>
      <div className="flex gap-12">
        <V28Popover trigger={<V28Button variant="primary">Left</V28Button>} side="left">
          <p className="text-sm">Popover positioned on left</p>
        </V28Popover>
        <V28Popover trigger={<V28Button variant="primary">Right</V28Button>} side="right">
          <p className="text-sm">Popover positioned on right</p>
        </V28Popover>
      </div>
      <V28Popover trigger={<V28Button variant="primary">Bottom</V28Button>} side="bottom">
        <p className="text-sm">Popover positioned on bottom</p>
      </V28Popover>
    </div>
  ),
};

export const UserMenu: Story = {
  render: () => (
    <div className="flex items-center justify-center p-12">
      <V28Popover
        trigger={
          <V28Button variant="ghost" size="sm" aria-label="User menu">
            <User className="h-5 w-5" />
          </V28Button>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-slate-700">
            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">John Doe</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">john@example.com</p>
            </div>
          </div>
          <div className="space-y-1">
            <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
              Profile
            </button>
            <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
              Settings
            </button>
            <button className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700">
              Sign Out
            </button>
          </div>
        </div>
      </V28Popover>
    </div>
  ),
};
