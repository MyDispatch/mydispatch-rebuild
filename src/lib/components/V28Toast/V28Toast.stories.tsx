import type { Meta, StoryObj } from "@storybook/react";
import { V28Toast, V28ToastProvider } from "./index";
import { useState } from "react";
import { V28Button } from "@/components/design-system/V28Button";

const meta: Meta<typeof V28Toast> = {
  title: "Design System/V28Toast",
  component: V28Toast,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <V28ToastProvider>
        <Story />
      </V28ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof V28Toast>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button variant="primary" onClick={() => setOpen(true)}>
          Show Toast
        </V28Button>
        <V28Toast
          open={open}
          onOpenChange={setOpen}
          title="Notification"
          description="This is a default toast notification"
        />
      </>
    );
  },
};

export const Success: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button variant="primary" onClick={() => setOpen(true)}>
          Show Success
        </V28Button>
        <V28Toast
          open={open}
          onOpenChange={setOpen}
          variant="success"
          title="Success!"
          description="Your changes have been saved successfully"
        />
      </>
    );
  },
};

export const Error: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button variant="primary" onClick={() => setOpen(true)}>
          Show Error
        </V28Button>
        <V28Toast
          open={open}
          onOpenChange={setOpen}
          variant="error"
          title="Error"
          description="Something went wrong. Please try again."
        />
      </>
    );
  },
};

export const Warning: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button variant="primary" onClick={() => setOpen(true)}>
          Show Warning
        </V28Button>
        <V28Toast
          open={open}
          onOpenChange={setOpen}
          variant="warning"
          title="Warning"
          description="Your session will expire in 5 minutes"
        />
      </>
    );
  },
};

export const WithAction: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <V28Button variant="primary" onClick={() => setOpen(true)}>
          Show with Action
        </V28Button>
        <V28Toast
          open={open}
          onOpenChange={setOpen}
          variant="info"
          title="Update Available"
          description="A new version is available"
          action={{
            label: "Update",
            onClick: () => alert("Updating..."),
          }}
        />
      </>
    );
  },
};
