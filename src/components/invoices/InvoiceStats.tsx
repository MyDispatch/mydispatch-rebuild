import { Card } from "@/lib/compat";
import { FileText, Send, CheckCircle, AlertCircle } from "lucide-react";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

interface Invoice {
  id: string;
  status: InvoiceStatus;
  total_amount: number;
}

interface InvoiceStatsProps {
  invoices: Invoice[];
}

export function InvoiceStats({ invoices }: InvoiceStatsProps) {
  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, i) => sum + i.total_amount, 0),
  };

  const statsConfig = [
    {
      title: "Gesamt",
      value: stats.total,
      icon: FileText,
      description: `${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(stats.totalAmount)}`,
    },
    {
      title: "Versendet",
      value: stats.sent,
      icon: Send,
      description: "Ausstehend",
    },
    {
      title: "Bezahlt",
      value: stats.paid,
      icon: CheckCircle,
      description: "Abgeschlossen",
    },
    {
      title: "Überfällig",
      value: stats.overdue,
      icon: AlertCircle,
      description: "Mahnung nötig",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
              <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
