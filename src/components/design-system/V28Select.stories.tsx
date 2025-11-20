import type { Meta, StoryObj } from "@storybook/react";
import { V28Select } from "./V28Select";

const meta: Meta<typeof V28Select> = {
  title: "Design System/Atoms/V28Select",
  component: V28Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof V28Select>;

const vehicleOptions = [
  { value: "", label: "Fahrzeug auswählen..." },
  { value: "sedan", label: "Limousine" },
  { value: "van", label: "Van" },
  { value: "bus", label: "Bus" },
];

export const Default: Story = {
  args: {
    options: vehicleOptions,
  },
};

export const WithLabel: Story = {
  args: {
    label: "Fahrzeugtyp",
    options: vehicleOptions,
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <V28Select label="Fahrzeugtyp" options={vehicleOptions} />
      <V28Select
        label="Status"
        options={[
          { value: "", label: "Status auswählen..." },
          { value: "available", label: "Verfügbar" },
          { value: "busy", label: "Im Einsatz" },
        ]}
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Deaktiviert",
    options: vehicleOptions,
    disabled: true,
  },
};
