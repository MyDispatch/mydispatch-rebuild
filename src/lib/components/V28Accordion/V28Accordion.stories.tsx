import type { Meta, StoryObj } from '@storybook/react';
import { V28Accordion } from './index';

const meta: Meta<typeof V28Accordion> = {
  title: 'Design System/V28Accordion',
  component: V28Accordion,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof V28Accordion>;

export const Default: Story = {
  args: {
    items: [
      {
        value: 'item-1',
        trigger: 'What is MyDispatch?',
        content: 'MyDispatch is a comprehensive dispatch management system for logistics and transportation.',
      },
      {
        value: 'item-2',
        trigger: 'How do I add drivers?',
        content: 'Navigate to the Drivers section and click the "Add Driver" button to create new driver profiles.',
      },
      {
        value: 'item-3',
        trigger: 'Can I track orders in real-time?',
        content: 'Yes, MyDispatch provides real-time tracking and status updates for all orders.',
      },
    ],
  },
};

export const SingleOpen: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'faq-1',
    items: [
      {
        value: 'faq-1',
        trigger: 'Shipping Information',
        content: 'We offer worldwide shipping with various delivery options to suit your needs.',
      },
      {
        value: 'faq-2',
        trigger: 'Return Policy',
        content: 'Items can be returned within 30 days of purchase with original packaging.',
      },
      {
        value: 'faq-3',
        trigger: 'Payment Methods',
        content: 'We accept all major credit cards, PayPal, and bank transfers.',
      },
    ],
  },
};

export const MultipleOpen: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['tech-1', 'tech-2'],
    items: [
      {
        value: 'tech-1',
        trigger: 'Frontend Technologies',
        content: 'Built with React, TypeScript, and Tailwind CSS for modern UI development.',
      },
      {
        value: 'tech-2',
        trigger: 'Backend Technologies',
        content: 'Powered by Supabase for authentication, database, and real-time features.',
      },
      {
        value: 'tech-3',
        trigger: 'Deployment',
        content: 'Deployed on Vercel with automatic CI/CD pipelines.',
      },
    ],
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      {
        value: 'item-1',
        trigger: 'Available Feature',
        content: 'This feature is currently available and fully functional.',
      },
      {
        value: 'item-2',
        trigger: 'Coming Soon',
        content: 'This feature will be available in the next release.',
        disabled: true,
      },
      {
        value: 'item-3',
        trigger: 'Beta Feature',
        content: 'This feature is in beta and may have limited functionality.',
      },
    ],
  },
};

export const DetailedContent: Story = {
  args: {
    items: [
      {
        value: 'setup',
        trigger: 'Getting Started',
        content: (
          <div className="space-y-2">
            <p className="font-semibold">Follow these steps:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Create an account</li>
              <li>Configure your settings</li>
              <li>Add your first driver</li>
              <li>Start dispatching orders</li>
            </ol>
          </div>
        ),
      },
      {
        value: 'features',
        trigger: 'Key Features',
        content: (
          <div className="space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Real-time order tracking</li>
              <li>Driver management</li>
              <li>Analytics dashboard</li>
              <li>Mobile app support</li>
            </ul>
          </div>
        ),
      },
    ],
  },
};
