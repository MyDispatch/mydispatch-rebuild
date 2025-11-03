/* ==================================================================================
   Simple Line Chart - V18.3.18 Sprint 41
   ==================================================================================
   - Lightweight SVG-basierter Chart für Mobile
   - Keine externe Library (Recharts) benötigt
   - Touch-optimiert mit Tooltips
   - Responsive & performant
   ================================================================================== */

import { useMemo } from 'react';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showDots?: boolean;
  formatValue?: (value: number) => string;
}

export function SimpleLineChart({
  data,
  height = 200,
  color = 'hsl(var(--primary))',
  showGrid = true,
  showDots = true,
  formatValue = (v) => v.toFixed(0),
}: SimpleLineChartProps) {
  const { points, maxValue, minValue } = useMemo(() => {
    if (data.length === 0) return { points: '', maxValue: 0, minValue: 0 };

    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1; // Verhindere Division durch 0

    // SVG-Punkte berechnen (0-300 width, 0-height)
    const svgPoints = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 300;
      const y = height - ((d.value - min) / range) * (height - 20);
      return `${x},${y}`;
    }).join(' ');

    return { points: svgPoints, maxValue: max, minValue: min };
  }, [data, height]);

  if (data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ height }}
      >
        Keine Daten verfügbar
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        width="100%"
        height={height}
        viewBox="0 0 300 200"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        {/* Grid-Linien (optional) */}
        {showGrid && (
          <g className="opacity-20">
            {[0, 25, 50, 75, 100].map((percent) => {
              const y = (height * percent) / 100;
              return (
                <line
                  key={percent}
                  x1="0"
                  y1={y}
                  x2="300"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              );
            })}
          </g>
        )}

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Gradient-Fill unter Line */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${height} ${points} 300,${height}`}
          fill="url(#gradient)"
        />

        {/* Dots (optional) */}
        {showDots && data.map((d, i) => {
          const x = (i / (data.length - 1)) * 300;
          const y = height - ((d.value - minValue) / (maxValue - minValue || 1)) * (height - 20);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill={color}
                className="transition-all hover:r-6"
              />
              {/* Tooltip beim Hover */}
              <title>{`${d.label || d.date}: ${formatValue(d.value)}`}</title>
            </g>
          );
        })}
      </svg>

      {/* Y-Axis Labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground pointer-events-none">
        <span>{formatValue(maxValue)}</span>
        <span>{formatValue(minValue)}</span>
      </div>
    </div>
  );
}
