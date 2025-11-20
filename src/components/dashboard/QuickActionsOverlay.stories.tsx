/* ==================================================================================
   QUICK ACTIONS OVERLAY STORIES - STORYBOOK V1.0
   ==================================================================================
   Stories for the QuickActionsOverlay component
   ================================================================================== */

import type { Meta, StoryObj } from "@storybook/react";
import { QuickActionsOverlay } from "./QuickActionsOverlay";

const meta: Meta<typeof QuickActionsOverlay> = {
  title: "Dashboard/QuickActionsOverlay",
  component: QuickActionsOverlay,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof QuickActionsOverlay>;

// Default State
export const Default: Story = {
  args: {
    pendingBookings: 5,
    availableDrivers: 12,
    availableVehicles: 18,
    todayRevenue: 3450.5,
  },
};

// High Activity
export const HighActivity: Story = {
  args: {
    pendingBookings: 23,
    availableDrivers: 8,
    availableVehicles: 15,
    todayRevenue: 8750.0,
  },
};

// Low Activity
export const LowActivity: Story = {
  args: {
    pendingBookings: 1,
    availableDrivers: 20,
    availableVehicles: 25,
    todayRevenue: 450.0,
  },
};

// No Pending Bookings
export const NoPendingBookings: Story = {
  args: {
    pendingBookings: 0,
    availableDrivers: 15,
    availableVehicles: 20,
    todayRevenue: 1200.0,
  },
};

// Limited Resources
export const LimitedResources: Story = {
  args: {
    pendingBookings: 15,
    availableDrivers: 2,
    availableVehicles: 3,
    todayRevenue: 5500.0,
  },
};

// No Revenue Yet
export const NoRevenue: Story = {
  args: {
    pendingBookings: 3,
    availableDrivers: 10,
    availableVehicles: 12,
    todayRevenue: 0,
  },
};
