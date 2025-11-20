/* ==================================================================================
   STORYBOOK: UNIVERSAL EXPORT BAR
   ================================================================================== */

import type { Meta, StoryObj } from '@storybook/react';
import { UniversalExportBar } from '@/components/dashboard/UniversalExportBar';

const meta: Meta<typeof UniversalExportBar> = {
  title: 'Dashboard/UniversalExportBar',
  component: UniversalExportBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UniversalExportBar>;

const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
];

export const Default: Story = {
  args: {
    data: sampleData,
    filename: 'export-data',
    showPdf: true,
    showExcel: true,
    showCsv: true,
  },
};

export const PdfOnly: Story = {
  args: {
    data: sampleData,
    filename: 'pdf-export',
    showPdf: true,
    showExcel: false,
    showCsv: false,
  },
};

export const ExcelAndCsv: Story = {
  args: {
    data: sampleData,
    filename: 'excel-csv-export',
    showPdf: false,
    showExcel: true,
    showCsv: true,
  },
};
