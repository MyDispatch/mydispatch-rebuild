import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";

interface MiniBarChartProps {
  data: number[];
  height?: number;
  color?: string;
  activeIndex?: number;
}

export function MiniBarChart({
  data,
  height = 40,
  color = "hsl(var(--primary))",
  activeIndex = -1,
}: MiniBarChartProps) {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === activeIndex ? color : `${color}80`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
