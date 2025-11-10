import React from 'react';
import { PublicLayout } from '@/layouts/tailadmin/PublicLayout';
import { Activity, TrendingUp, Users, Package } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, trend }: { icon: any; title: string; value: string; trend?: string }) => (
  <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-xl font-semibold">{value}</div>
        {trend && <div className="text-xs text-muted-foreground">{trend}</div>}
      </div>
    </div>
  </div>
);

const RecentTable = () => (
  <div className="rounded-lg border border-border bg-card shadow-sm">
    <div className="border-b border-border p-4">
      <h3 className="text-sm font-medium">Letzte Aktivitäten</h3>
    </div>
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Datum</th>
              <th className="px-3 py-2 text-left">Typ</th>
              <th className="px-3 py-2 text-left">Beschreibung</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-3 py-2">2025-11-10</td>
                <td className="px-3 py-2">Auftrag</td>
                <td className="px-3 py-2">Beispiel-Aktivität #{i + 1}</td>
                <td className="px-3 py-2">
                  <span className="rounded bg-secondary/20 px-2 py-1 text-xs text-secondary">OK</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const TailAdminDashboard: React.FC = () => {
  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Öffentliches Dashboard</h1>
            <p className="text-sm text-muted-foreground">TailAdmin-Layout für den Public-Bereich, CI/CD-ready.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Activity} title="Systemstatus" value="Stabil" trend="Letzte 24h" />
          <StatCard icon={TrendingUp} title="Performance" value="98%" trend="+1.2% vs. Vortag" />
          <StatCard icon={Users} title="Nutzer aktiv" value="1.245" trend="+45 heute" />
          <StatCard icon={Package} title="Aufträge" value="327" trend="+12 heute" />
        </div>

        <RecentTable />
      </div>
    </PublicLayout>
  );
};

export default TailAdminDashboard;

