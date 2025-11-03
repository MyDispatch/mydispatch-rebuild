import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  centerText?: string;
}

export function DonutChart({ 
  value, 
  max, 
  size = 80, 
  strokeWidth = 8,
  color = 'hsl(var(--primary))',
  label,
  centerText
}: DonutChartProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const data = [
    { value: percentage, fill: color },
    { value: 100 - percentage, fill: 'hsl(var(--muted))' }
  ];

  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius={size / 2 - strokeWidth}
            outerRadius={size / 2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {centerText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-foreground">{centerText}</span>
          {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
        </div>
      )}
    </div>
  );
}
