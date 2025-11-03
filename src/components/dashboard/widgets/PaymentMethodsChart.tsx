/* ==================================================================================
   PAYMENT METHODS CHART V28.1 - PURE TAILWIND
   ==================================================================================
   Zahlungsarten Pie-Chart - Rechte Spalte Position 2
   ✅ Pure Tailwind Slate Design
   ✅ Recharts Pie Chart
   ✅ Bar/Rechnung/Karte Distribution
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from '@/lib/compat';
import { FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/format-utils';

interface PaymentMethod {
  name: string;
  value: number;
  color: string;
}

interface PaymentMethodsChartProps {
  data: PaymentMethod[];
}

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-slate-100">
            <FileText className="h-4 w-4 text-slate-700" />
          </div>
          <CardTitle className="text-sm font-semibold text-slate-900">
            Zahlungsarten
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {data.length === 0 || total === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-slate-600">
              Keine Daten verfügbar
            </p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid rgb(226 232 240)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {data.map((method, index) => (
                <div
                  key={method.name}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: method.color }}
                    />
                    <span className="text-xs font-medium text-slate-900">
                      {method.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {formatCurrency(method.value)}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      {total > 0 ? Math.round((method.value / total) * 100) : 0}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
