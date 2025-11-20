/* ==================================================================================
   MOBILE-OPTIMIERTE DOKUMENTE-ANSICHT V18.3 - MIT GRID-LAYOUT
   ==================================================================================
   Verwendet MobileGridLayout für standardisierte Struktur
   ================================================================================== */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { V28Button } from "@/components/design-system/V28Button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, Download, Calendar } from "lucide-react";
import { MobileGridLayout } from "./MobileGridLayout";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface Document {
  id: string;
  entity_type: string;
  entity_id: string;
  document_type: string;
  name: string;
  file_url: string;
  expiry_date: string | null;
  reminder_sent?: boolean;
  tags?: string[] | null;
  created_at: string;
}

interface MobileDokumenteProps {
  documents: Document[];
  isLoading: boolean;
  onCreateNew: () => void;
  onDocumentClick: (document: Document) => void;
  onRefresh: () => void;
}

export function MobileDokumente({
  documents,
  isLoading,
  onCreateNew,
  onDocumentClick,
  onRefresh,
}: MobileDokumenteProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return "neutral";

    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return "error";
    if (daysUntilExpiry <= 30) return "warning";
    return "success";
  };

  const filteredDocuments = documents.filter((doc) => {
    const status = getExpiryStatus(doc.expiry_date);

    if (activeFilter === "valid" && status !== "success") return false;
    if (activeFilter === "expiring" && status !== "warning") return false;
    if (activeFilter === "expired" && status !== "error") return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        doc.name.toLowerCase().includes(query) || doc.document_type.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const validCount = documents.filter((d) => getExpiryStatus(d.expiry_date) === "success").length;
  const expiringCount = documents.filter(
    (d) => getExpiryStatus(d.expiry_date) === "warning"
  ).length;
  const expiredCount = documents.filter((d) => getExpiryStatus(d.expiry_date) === "error").length;

  const filters = [
    { id: "all", label: "Alle", count: documents.length },
    { id: "valid", label: "Gültig", count: validCount },
    { id: "expiring", label: "Läuft ab", count: expiringCount },
    { id: "expired", label: "Abgelaufen", count: expiredCount },
  ];

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fuehrerschein: "Führerschein",
      p_schein: "P-Schein",
      fahrzeugschein: "Fahrzeugschein",
      tuev: "TÜV",
      versicherung: "Versicherung",
      sonstiges: "Sonstiges",
    };
    return labels[type] || type;
  };

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      driver: "Fahrer",
      vehicle: "Fahrzeug",
      customer: "Kunde",
    };
    return labels[type] || type;
  };

  const getExpiryLabel = (expiryDate: string | null) => {
    if (!expiryDate) return "Kein Ablaufdatum";

    const status = getExpiryStatus(expiryDate);
    if (status === "error") return "Abgelaufen";
    if (status === "warning") return "Läuft bald ab";
    return "Gültig";
  };

  return (
    <MobileGridLayout<Document>
      searchPlaceholder="Suchen..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onRefresh={onRefresh}
      isLoading={isLoading}
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      data={filteredDocuments}
      renderCard={(doc) => (
        <Card className="cursor-pointer hover:bg-primary/5 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1">{doc.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>
                    {doc.document_type === "license"
                      ? "Führerschein"
                      : doc.document_type === "registration"
                        ? "Fahrzeugschein"
                        : doc.document_type === "insurance"
                          ? "Versicherung"
                          : "Sonstiges"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium line-clamp-1">{doc.name}</p>
                {doc.expiry_date && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Ablauf: {format(new Date(doc.expiry_date), "dd.MM.yyyy", { locale: de })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t" onClick={(e) => e.stopPropagation()}>
              <V28Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => window.open(doc.file_url, "_blank")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </V28Button>
            </div>
          </CardContent>
        </Card>
      )}
      onItemClick={onDocumentClick}
      entityLabel={{ singular: "Dokument", plural: "Dokumente" }}
      fabLabel="Dokument hochladen"
      onFabClick={onCreateNew}
      fabIcon={Plus}
      emptyStateProps={{
        icon: <FileText className="h-16 w-16" />,
        noDataTitle: "Keine Dokumente",
        noDataDescription: "Lade dein erstes Dokument hoch",
        noResultsTitle: "Keine Ergebnisse",
        noResultsDescription: "Versuche einen anderen Suchbegriff",
      }}
    />
  );
}
