import type { Meta, StoryObj } from '@storybook/react';
import { V28Select } from './V28Select';
import { useState } from 'react';

const meta: Meta<typeof V28Select> = {
  title: 'Design System/V28Select',
  component: V28Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof V28Select>;

const simpleOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

const countryOptions = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Spain', value: 'es' },
];

export const Default: Story = {
  args: {
    options: simpleOptions,
    placeholder: 'Select an option',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select country',
  },
};

export const WithError: Story = {
  args: {
    label: 'Required Field',
    options: simpleOptions,
    placeholder: 'Please select',
    error: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    options: simpleOptions,
    disabled: true,
    value: 'option1',
  },
};

export const PreSelected: Story = {
  args: {
    label: 'Pre-selected Value',
    options: simpleOptions,
    value: 'option2',
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');
    
    return (
      <div className="w-96 space-y-4">
        <V28Select
          label="Select an option"
          options={simpleOptions}
          placeholder="Choose..."
          value={value}
          onChange={setValue}
        />
        {value && (
          <div className="text-sm text-slate-600">
            Selected value: <strong>{value}</strong>
          </div>
        )}
      </div>
    );
  },
};

export const MultipleSelects: Story = {
  render: () => {
    const [country, setCountry] = useState('');
    const [option, setOption] = useState('');
    
    return (
      <div className="w-96 space-y-4">
        <V28Select
          label="Country"
          options={countryOptions}
          placeholder="Select country"
          value={country}
          onChange={setCountry}
        />
        <V28Select
          label="Option"
          options={simpleOptions}
          placeholder="Select option"
          value={option}
          onChange={setOption}
        />
        {(country || option) && (
          <div className="text-sm text-slate-600">
            {country && <div>Country: <strong>{country}</strong></div>}
            {option && <div>Option: <strong>{option}</strong></div>}
          </div>
        )}
      </div>
    );
  },
};

export const DarkMode: Story = {
  args: {
    label: 'Dark Mode Select',
    options: simpleOptions,
    placeholder: 'Select...',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
