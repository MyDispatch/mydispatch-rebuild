import { Input } from "@/lib/compat";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/compat";
import { Search } from "lucide-react";
type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

interface InvoiceFiltersProps {
  statusFilter: InvoiceStatus | "all";
  onStatusFilterChange: (status: InvoiceStatus | "all") => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export function InvoiceFilters({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
}: InvoiceFiltersProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="search">Suche</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Rechnungsnummer oder Kunde..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as InvoiceStatus | "all")}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Alle Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="draft">Entwurf</SelectItem>
            <SelectItem value="sent">Versendet</SelectItem>
            <SelectItem value="paid">Bezahlt</SelectItem>
            <SelectItem value="overdue">Überfällig</SelectItem>
            <SelectItem value="cancelled">Storniert</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
