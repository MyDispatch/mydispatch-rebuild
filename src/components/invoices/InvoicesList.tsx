import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { V28Button } from "@/components/design-system/V28Button";
import { Eye, Download, Send, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "date-fns";
import { de } from "date-fns/locale";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

interface Invoice {
  id: string;
  invoice_number: string;
  status: InvoiceStatus;
  customer_id: string;
  total_amount: number;
  created_at: string;
  due_date: string;
}

interface InvoicesListProps {
  invoices: Invoice[];
  isLoading: boolean;
}

const statusConfig: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Entwurf", variant: "secondary" },
  sent: { label: "Versendet", variant: "default" },
  paid: { label: "Bezahlt", variant: "outline" },
  overdue: { label: "Überfällig", variant: "destructive" },
  cancelled: { label: "Storniert", variant: "secondary" },
};

export function InvoicesList({ invoices, isLoading }: InvoicesListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  if (!invoices.length) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Keine Rechnungen gefunden</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-foreground">
                  {invoice.invoice_number}
                </h3>
                <Badge variant={statusConfig[invoice.status].variant}>
                  {statusConfig[invoice.status].label}
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-sm">
                Kunden-ID: {invoice.customer_id.substring(0, 8)}...
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>
                  Erstellt: {formatDate(new Date(invoice.created_at), "dd.MM.yyyy", { locale: de })}
                </span>
                <span>
                  Fällig: {formatDate(new Date(invoice.due_date), "dd.MM.yyyy", { locale: de })}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  {new Intl.NumberFormat('de-DE', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }).format(invoice.total_amount)}
                </p>
              </div>

              <div className="flex gap-2">
                <V28Button variant="secondary" size="sm">
                  <Eye className="h-4 w-4" />
                </V28Button>
                <V28Button variant="secondary" size="sm">
                  <Download className="h-4 w-4" />
                </V28Button>
                {invoice.status === 'draft' && (
                  <V28Button variant="secondary" size="sm">
                    <Send className="h-4 w-4" />
                  </V28Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <V28Button variant="secondary" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </V28Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                    <DropdownMenuItem>Duplizieren</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Stornieren
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
