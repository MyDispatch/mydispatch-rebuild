import { Card } from "@/components/ui/card";
import { V28Button } from "@/components/design-system/V28Button";
import { StatCard } from "@/components/smart-templates/StatCard";
import { MobileActionCard } from "./MobileActionCard";
import {
  Plus,
  Calendar,
  MessageSquare,
  FileText,
  Users,
  Car,
  AlertCircle,
  Clock,
  FileWarning,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/format-utils";

interface MobileDashboardProps {
  profile: any;
  totalBookings: number;
  totalRevenue: number;
  activeDrivers: number;
  vehiclesInUse: number;
  expiringDocuments: number;
  overdueInvoices: number;
  overdueAmount: number;
  onNavigate: (path: string, state?: any) => void;
}

export function MobileDashboard({
  profile,
  totalBookings,
  totalRevenue,
  activeDrivers,
  vehiclesInUse,
  expiringDocuments,
  overdueInvoices,
  overdueAmount,
  onNavigate,
}: MobileDashboardProps) {
  // Urgent Actions
  const urgentActions = [
    ...(expiringDocuments > 0
      ? [
          {
            id: "documents",
            type: "warning" as const,
            title: `${expiringDocuments} Dokumente laufen ab`,
            description: "In den nächsten 30 Tagen",
            icon: FileWarning,
            onClick: () => onNavigate("/dokumente", { filter: "expiring" }),
          },
        ]
      : []),
    ...(overdueInvoices > 0
      ? [
          {
            id: "invoices",
            type: "error" as const,
            title: `${overdueInvoices} Rechnungen überfällig`,
            description: `Gesamt: ${formatCurrency(overdueAmount)}`,
            icon: AlertCircle,
            onClick: () => onNavigate("/rechnungen", { filter: "overdue" }),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-none shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl font-bold">
            Willkommen zurück{profile?.first_name ? `, ${profile.first_name}` : ""}!
          </h1>
          <p className="text-sm text-muted-foreground">Hier ist Ihre Übersicht für heute</p>
        </div>
      </Card>

      {/* KPI Cards - 2 Spalten */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Aufträge"
          value={totalBookings}
          icon={FileText}
          onClick={() => onNavigate("/auftraege")}
        />
        <StatCard
          label="Umsatz"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          onClick={() => onNavigate("/statistiken")}
        />
        <StatCard
          label="Fahrer"
          value={`${activeDrivers} aktiv`}
          icon={Users}
          onClick={() => onNavigate("/fahrer")}
        />
        <StatCard
          label="Fahrzeuge"
          value={`${vehiclesInUse} Verfügbar`}
          icon={Car}
          onClick={() => onNavigate("/fahrzeuge")}
        />
      </div>

      {/* Urgent Actions */}
      {urgentActions.length > 0 && (
        <Card className="p-4 border-status-warning/20 bg-status-warning/5">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-foreground" />
            Dringende Aktionen
          </h2>
          <div className="space-y-3">
            {urgentActions.map((action) => (
              <MobileActionCard key={action.id} action={action} />
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold mb-4">Schnellaktionen</h2>
        <div className="grid grid-cols-2 gap-3">
          <V28Button
            variant="primary"
            size="lg"
            className="h-auto py-4 flex-col gap-2 shadow-sm"
            onClick={() => onNavigate("/auftraege", { state: { openCreateDialog: true } })}
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">Neuer Auftrag</span>
          </V28Button>
          <V28Button
            variant="secondary"
            size="lg"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => onNavigate("/schichtzettel")}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">Schichtzettel</span>
          </V28Button>
          <V28Button
            variant="secondary"
            size="lg"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => onNavigate("/kunden")}
          >
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium">Kunden</span>
          </V28Button>
          <V28Button
            variant="secondary"
            size="lg"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => onNavigate("/kommunikation")}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm font-medium">Team-Chat</span>
          </V28Button>
        </div>
      </Card>
    </div>
  );
}
