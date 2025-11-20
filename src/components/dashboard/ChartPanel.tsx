/* ==================================================================================
   CHART PANEL - Revenue & Booking Charts Component
   ==================================================================================
   ✅ Using recharts for data visualization
   ✅ Consistent Card wrapper with p-4
   ✅ Height: h-80 for charts
   ✅ Responsive width
   ✅ Professional color scheme from design tokens
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Euro, FileText } from 'lucide-react';
import { useState } from 'react';

interface ChartData {
  name: string;
  revenue: number;
  bookings: number;
  average: number;
}

interface ChartPanelProps {
  data?: ChartData[];
  title?: string;
  type?: 'line' | 'bar';
  className?: string;
}

// Mock data for demonstration
const defaultData: ChartData[] = [
  { name: 'Mo', revenue: 2400, bookings: 24, average: 100 },
  { name: 'Di', revenue: 3200, bookings: 32, average: 100 },
  { name: 'Mi', revenue: 2800, bookings: 28, average: 100 },
  { name: 'Do', revenue: 3500, bookings: 35, average: 100 },
  { name: 'Fr', revenue: 4100, bookings: 41, average: 100 },
  { name: 'Sa', revenue: 3800, bookings: 38, average: 100 },
  { name: 'So', revenue: 2900, bookings: 29, average: 100 },
];

export function ChartPanel({ 
  data = defaultData, 
  title = 'Umsatz & Aufträge', 
  type = 'line',
  className = '' 
}: ChartPanelProps) {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'bookings' | 'both'>('both');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-700">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Umsatz' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`bg-white ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Diese Woche</SelectItem>
              <SelectItem value="month">Dieser Monat</SelectItem>
              <SelectItem value="year">Dieses Jahr</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Nur Umsatz</SelectItem>
              <SelectItem value="bookings">Nur Aufträge</SelectItem>
              <SelectItem value="both">Beides</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => selectedMetric === 'bookings' ? value : formatCurrency(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '14px' }}
                  iconType="line"
                />
                {(selectedMetric === 'revenue' || selectedMetric === 'both') && (
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Umsatz"
                    stroke="#323D5E" 
                    strokeWidth={2}
                    dot={{ fill: '#323D5E', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {(selectedMetric === 'bookings' || selectedMetric === 'both') && (
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    name="Aufträge"
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  name="Durchschnitt"
                  stroke="#94a3b8" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => selectedMetric === 'bookings' ? value : formatCurrency(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '14px' }}
                  iconType="rect"
                />
                {(selectedMetric === 'revenue' || selectedMetric === 'both') && (
                  <Bar 
                    dataKey="revenue" 
                    name="Umsatz"
                    fill="#323D5E" 
                    radius={[8, 8, 0, 0]}
                  />
                )}
                {(selectedMetric === 'bookings' || selectedMetric === 'both') && (
                  <Bar 
                    dataKey="bookings" 
                    name="Aufträge"
                    fill="#10b981" 
                    radius={[8, 8, 0, 0]}
                  />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium">Gesamt Umsatz</p>
            <p className="text-lg font-bold text-slate-800">
              {formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium">Gesamt Aufträge</p>
            <p className="text-lg font-bold text-slate-800">
              {data.reduce((sum, d) => sum + d.bookings, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium">Ø pro Tag</p>
            <p className="text-lg font-bold text-slate-800">
              {formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0) / data.length)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChartPanel;