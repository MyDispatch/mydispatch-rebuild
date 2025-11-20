import { LineChart, Line, ResponsiveContainer } from "recharts";

interface TrendLineProps {
  data: number[];
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export function TrendLine({
  data,
  height = 40,
  color = "hsl(var(--primary))",
  strokeWidth = 2,
}: TrendLineProps) {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={strokeWidth}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
