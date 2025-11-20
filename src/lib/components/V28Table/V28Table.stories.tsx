import type { Meta, StoryObj } from "@storybook/react";
import { V28Table } from "./index";
import { V28Badge } from "../V28Badge";

const meta: Meta<typeof V28Table> = {
  title: "Design System/V28Table",
  component: V28Table,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof V28Table>;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

const sampleData: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "inactive" },
];

export const Default: Story = {
  args: {
    columns: [
      { key: "id", header: "ID" },
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
      { key: "role", header: "Role" },
      { key: "status", header: "Status" },
    ],
    data: sampleData,
  },
};

export const WithCustomRender: Story = {
  args: {
    columns: [
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
      {
        key: "status",
        header: "Status",
        render: (user: User) => (
          <V28Badge
            label={user.status}
            variant={user.status === "active" ? "success" : "neutral"}
          />
        ),
      },
    ],
    data: sampleData,
  },
};

export const Empty: Story = {
  args: {
    columns: [
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
    ],
    data: [],
    emptyMessage: "No users found",
  },
};

export const Clickable: Story = {
  args: {
    columns: [
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
      { key: "role", header: "Role" },
    ],
    data: sampleData,
    onRowClick: (user: User) => alert(`Clicked on ${user.name}`),
  },
};
