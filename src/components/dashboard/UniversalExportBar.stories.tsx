import type { Meta, StoryObj } from "@storybook/react";
import { UniversalExportBar } from "./UniversalExportBar";

const meta: Meta<typeof UniversalExportBar> = {
  title: "Dashboard/UniversalExportBar",
  component: UniversalExportBar,
  tags: ["autodocs"],
  argTypes: {
    showPdf: { control: "boolean" },
    showExcel: { control: "boolean" },
    showCsv: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof UniversalExportBar>;

export const AllFormats: Story = {
  args: {
    data: [{ id: 1, name: "Test" }],
    filename: "export-test",
    showPdf: true,
    showExcel: true,
    showCsv: true,
  },
};

export const PdfOnly: Story = {
  args: {
    data: [{ id: 1, name: "Test" }],
    filename: "pdf-export",
    showPdf: true,
    showExcel: false,
    showCsv: false,
  },
};

export const ExcelOnly: Story = {
  args: {
    data: [{ id: 1, name: "Test" }],
    filename: "excel-export",
    showPdf: false,
    showExcel: true,
    showCsv: false,
  },
};
