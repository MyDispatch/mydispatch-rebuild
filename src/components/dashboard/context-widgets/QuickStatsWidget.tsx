/* ==================================================================================
   QUICK STATS WIDGET - Context Widget für Daten-Dashboards
   ==================================================================================
   ✅ Kompakte Key-Value Statistiken
   ✅ Perfekt für Aufträge, Kunden, Fahrer, etc.
   ✅ Flexible Stat-Definition
   ================================================================================== */

interface QuickStat {
  label: string;
  value: string | number;
  highlight?: boolean;
}

interface QuickStatsWidgetProps {
  stats: QuickStat[];
}

export function QuickStatsWidget({ stats }: QuickStatsWidgetProps) {
  return (
    <div className="space-y-2">
      {stats.map((stat, index) => (
        <div key={index} className="flex justify-between items-center text-xs">
          <span className="text-slate-600">{stat.label}</span>
          <span className={`font-semibold ${stat.highlight ? "text-blue-600" : "text-slate-900"}`}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * USAGE EXAMPLE:
 *
 * <QuickStatsWidget
 *   stats={[
 *     { label: 'Heute', value: '12', highlight: true },
 *     { label: 'Diese Woche', value: '87' },
 *     { label: 'Dieser Monat', value: '342' },
 *     { label: 'Gesamt', value: '1.234' }
 *   ]}
 * />
 */
