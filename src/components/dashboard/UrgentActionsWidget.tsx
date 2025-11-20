import { Card, CardContent, CardHeader, CardTitle } from "@/lib/compat";
import { Badge } from "@/lib/compat";
import { AlertCircle, FileText, Clock, ChevronRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/format-utils";

interface UrgentActionsWidgetProps {
  expiringDocuments?: number;
  overdueInvoices?: number;
  overdueAmount?: number;
  unassignedBookings?: number;
}

export function UrgentActionsWidget({
  expiringDocuments = 0,
  overdueInvoices = 0,
  overdueAmount = 0,
  unassignedBookings = 0,
}: UrgentActionsWidgetProps) {
  const navigate = useNavigate();

  const urgentActions = [
    ...(expiringDocuments > 0
      ? [
          {
            type: "error" as const,
            icon: FileText,
            title: `${expiringDocuments} Dokument${expiringDocuments > 1 ? "e" : ""} läuft ab`,
            description: "In den nächsten 30 Tagen",
            badge: "KRITISCH",
            onClick: () => navigate("/dokumente?filter=expiring"),
          },
        ]
      : []),
    ...(overdueInvoices > 0
      ? [
          {
            type: "warning" as const,
            icon: FileText,
            title: `${overdueInvoices} Rechnung${overdueInvoices > 1 ? "en" : ""} überfällig`,
            description: formatCurrency(overdueAmount),
            badge: "WICHTIG",
            onClick: () => navigate("/rechnungen?filter=overdue"),
          },
        ]
      : []),
    ...(unassignedBookings > 0
      ? [
          {
            type: "info" as const,
            icon: Clock,
            title: `${unassignedBookings} Auftrag${unassignedBookings > 1 ? "äge" : ""} offen`,
            description: "Bitte zuweisen",
            badge: "OFFEN",
            onClick: () => navigate("/auftraege?status=pending"),
          },
        ]
      : []),
  ];

  const getTypeStyles = (type: "error" | "warning" | "info") => {
    switch (type) {
      case "error":
        return "border-status-error/20 bg-status-error/5 hover:bg-status-error/10";
      case "warning":
        return "border-status-warning/20 bg-status-warning/5 hover:bg-status-warning/10";
      case "info":
        return "border-primary/30 bg-primary/5 hover:bg-primary/10";
    }
  };

  return (
    <Card className="w-full h-full border shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-foreground" />
            Dringende Aktionen
          </CardTitle>
          {urgentActions.length > 0 && (
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5 bg-status-warning/10 text-status-warning border-status-warning/30"
            >
              {urgentActions.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-3 flex-1 overflow-y-auto">
        {urgentActions.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-status-success/10 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Alles erledigt!</p>
            <p className="text-xs text-muted-foreground mt-1">
              Keine dringenden Aktionen erforderlich
            </p>
          </div>
        ) : (
          urgentActions.map((action, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${getTypeStyles(action.type)}`}
              onClick={action.onClick}
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-background/50 flex-shrink-0">
                  <action.icon className="h-4 w-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {action.title}
                    </p>
                    <Badge
                      variant={
                        action.type === "error"
                          ? "destructive"
                          : action.type === "warning"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-[10px] px-1.5 py-0 flex-shrink-0"
                    >
                      {action.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
