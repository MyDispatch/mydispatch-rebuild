/* ==================================================================================
   KRITISCHER HINWEIS: Partner - DESIGN/LAYOUT FINAL, FUNKTIONAL ERWEITERBAR!
   ==================================================================================
   - Design, Layout und UI-Komponenten sind FINAL (visuell)
   - Alle funktionalen Elemente gemäß SPEZIFIKATION integriert
   - NUR technische Bugfixes UND funktionale Implementierungen erlaubt
   ================================================================================== */

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePartners } from "@/hooks/use-partners";
import { useDeviceType } from "@/hooks/use-device-type";
import { useTouchTargetValidation } from "@/hooks/validation/useTouchTargetValidation";
import { useMainLayout } from "@/hooks/use-main-layout";
import { supabase } from "@/integrations/supabase/client";
import { StandardPageLayout } from "@/components/layout/StandardPageLayout";
import { V28Button } from "@/components/design-system/V28Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Handshake, Send, CheckCircle, Eye, Download } from "lucide-react";
import { DetailDialog } from "@/components/shared/DetailDialog";
import { handleError, handleSuccess } from "@/lib/error-handler";
import { PartnerForm } from "@/components/forms/PartnerForm";
import { StatusIndicator, getPartnerStatusType } from "@/components/shared/StatusIndicator";
import { formatCurrency } from "@/lib/index";
import { FeatureGate } from "@/components/shared/FeatureGate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PartnerRequestDialog } from "@/components/partner/PartnerRequestDialog";
import { PartnerConnectionList } from "@/components/partner/PartnerConnectionList";
import { MobilePartner } from "@/components/mobile/MobilePartner";
import { KPIGenerator, QuickActionsGenerator } from "@/lib/dashboard-automation";
import { V28StatCard } from "@/components/design-system";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface Partner {
  id: string;
  company_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  provision_amount: number;
  online_access_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export default function Partner() {
  // ✅ ALLE HOOKS ZUERST
  useTouchTargetValidation();
  const { profile } = useAuth();
  const { toast } = useToast();
  const { isMobile } = useDeviceType();
  const { sidebarExpanded } = useMainLayout();
  const { partners, isLoading: loading, archivePartner, isArchiving } = usePartners();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("own");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Pending Requests manuell laden (nicht in use-partners.tsx)
  const fetchPendingRequests = async () => {
    if (!profile?.company_id) return;

    try {
      const { data, error } = await supabase
        .from("partner_requests")
        .select("*, requesting_company:companies!partner_requests_requesting_company_id_fkey(name)")
        .eq("target_company_id", profile.company_id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPendingRequests(data || []);
    } catch (error: any) {
      handleError(error, "Fehler beim Laden der Anfragen");
    }
  };

  // Initial Load
  useEffect(() => {
    if (profile?.company_id) {
      fetchPendingRequests();
    }
  }, [profile?.company_id]);

  const handleArchive = async (partner: Partner) => {
    archivePartner(partner.id);
    setDetailDialogOpen(false);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPartner(null);
    // React Query invalidiert automatisch
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("partner_requests")
        .update({ status: "accepted" })
        .eq("id", requestId);

      if (error) throw error;

      handleSuccess("Partner-Anfrage angenommen");
      fetchPendingRequests();
    } catch (error: any) {
      handleError(error, "Anfrage konnte nicht angenommen werden");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("partner_requests")
        .update({ status: "rejected" })
        .eq("id", requestId);

      if (error) throw error;

      handleSuccess("Partner-Anfrage abgelehnt");
      fetchPendingRequests();
    } catch (error: any) {
      handleError(error, "Anfrage konnte nicht abgelehnt werden");
    }
  };

  const filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.phone?.includes(searchTerm)
  );

  // ==================================================================================
  // V18.5.1: SSOT - Einheitliche KPIs und Quick Actions für Mobile + Desktop
  // ==================================================================================
  const partnerKPIs = useMemo(
    () =>
      [
        KPIGenerator.partners.total(partners.length),
        KPIGenerator.partners.active(partners.filter((p) => p.online_access_enabled).length),
        KPIGenerator.custom({
          title: "Offene Anfragen",
          value: pendingRequests.length,
          icon: Send,
        }),
      ] as [any, any, any],
    [partners, pendingRequests]
  );

  const partnerQuickActions: [any, any] = useMemo(
    () => [
      QuickActionsGenerator.create("Neuer Partner", Plus, () => setShowForm(true)),
      QuickActionsGenerator.custom({
        label: "Partner-Anfrage",
        icon: Send,
        onClick: () => setShowRequestDialog(true),
      }),
    ],
    []
  );

  // ✅ MOBILE VIEW
  if (isMobile) {
    return (
      <FeatureGate requiredTariff="Business" feature="Partnerverwaltung">
        <StandardPageLayout
          title="Partner"
          description="Partnerverwaltung für MyDispatch"
          canonical="/partner"
          subtitle="Vernetzen Sie sich mit anderen MyDispatch-Unternehmen"
          onCreateNew={() => setShowForm(true)}
          createButtonLabel="Neuer Partner"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Partner suchen..."
        >
          {/* ✅ V6.1: StatCards Pattern (Golden Template) */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {partnerKPIs.map((kpi, index) => (
              <V28StatCard
                key={index}
                label={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
                change={
                  kpi.trend
                    ? {
                        value: kpi.trend.value,
                        trend: kpi.trend.value >= 0 ? "up" : "down",
                      }
                    : undefined
                }
              />
            ))}
          </div>

          <MobilePartner
            partners={filteredPartners}
            isLoading={loading}
            onCreateNew={() => setShowForm(true)}
            onPartnerClick={(partner: any) => {
              setSelectedPartner(partner);
              setDetailDialogOpen(true);
            }}
            onRefresh={() => window.location.reload()}
          />
        </StandardPageLayout>

        {/* Dialogs (shared between Mobile & Desktop) */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPartner ? "Partner bearbeiten" : "Neuer Partner"}</DialogTitle>
              <DialogDescription>
                Partner können Aufträge ohne eigenen Login-Zugang bearbeiten
              </DialogDescription>
            </DialogHeader>
            <PartnerForm
              partner={editingPartner}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingPartner(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {selectedPartner && (
          <DetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            title={`Partner: ${selectedPartner.name}`}
            onArchive={() => handleArchive(selectedPartner)}
            onEdit={() => {
              handleEdit(selectedPartner);
              setDetailDialogOpen(false);
            }}
            showArchive={true}
            createdAt={selectedPartner.created_at}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <p className="font-medium">{selectedPartner.name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">E-Mail:</span>
                  <p className="font-medium">{selectedPartner.email || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Telefon:</span>
                  <p className="font-medium">{selectedPartner.phone || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Provision:</span>
                  <p className="font-medium">{formatCurrency(selectedPartner.provision_amount)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Online-Zugang:</span>
                  <div className="mt-1">
                    <StatusIndicator
                      type={getPartnerStatusType(selectedPartner.online_access_enabled)}
                      label={selectedPartner.online_access_enabled ? "Aktiv" : "Inaktiv"}
                      size="sm"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Zuletzt aktualisiert:</span>
                  <p className="font-medium">
                    {format(new Date(selectedPartner.updated_at), "dd.MM.yyyy HH:mm", {
                      locale: de,
                    })}{" "}
                    Uhr
                  </p>
                </div>
              </div>
            </div>
          </DetailDialog>
        )}
      </FeatureGate>
    );
  }

  return (
    <>
      <FeatureGate requiredTariff="Business" feature="Partnerverwaltung">
        {/* ✅ MAIN CONTENT */}
        <StandardPageLayout
          title="Partnerverwaltung"
          description="Partnerverwaltung für MyDispatch - Verwalten Sie externe Partner"
          canonical="/partner"
          subtitle="Vernetzen Sie sich mit anderen MyDispatch-Unternehmen"
          onCreateNew={() => setShowForm(true)}
          createButtonLabel="Neuer Partner"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Partner durchsuchen..."
          cardTitle="Partner-Übersicht"
          cardIcon={<Handshake className="h-5 w-5" />}
        >
          {/* ✅ V6.1: StatCards Pattern (Golden Template) */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {partnerKPIs.map((kpi, index) => (
              <V28StatCard
                key={index}
                label={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
                change={
                  kpi.trend
                    ? {
                        value: kpi.trend.value,
                        trend: kpi.trend.value >= 0 ? "up" : "down",
                      }
                    : undefined
                }
              />
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="own" className="min-h-[44px] flex-wrap gap-1">
                <Handshake className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Meine Partner</span>
                <span className="sm:hidden">Partner</span>
              </TabsTrigger>
              <TabsTrigger value="requests" className="min-h-[44px] flex-wrap gap-1">
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Anfragen</span>
                <span className="sm:hidden">Anfragen</span>
                {pendingRequests.length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {pendingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="own" className="space-y-4 mt-6">
              {profile?.company_id && (
                <PartnerConnectionList currentCompanyId={profile.company_id} />
              )}
            </TabsContent>

            <TabsContent value="requests" className="space-y-4 mt-6">
              {loading ? (
                <Card>
                  <CardContent className="p-6 sm:p-8 text-center">
                    <p className="text-muted-foreground">Lade Anfragen...</p>
                  </CardContent>
                </Card>
              ) : pendingRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-6 sm:p-8 text-center">
                    <p className="text-muted-foreground">Keine offenen Anfragen.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pendingRequests.map((request) => (
                    <Card key={request.id}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Send className="h-5 w-5" />
                          Anfrage von {request.requesting_company?.name || "Unbekannt"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {request.message && (
                          <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm">{request.message}</p>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <V28Button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="w-full sm:w-auto"
                            variant="primary"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Annehmen
                          </V28Button>
                          <V28Button
                            variant="secondary"
                            onClick={() => handleRejectRequest(request.id)}
                            className="w-full sm:w-auto"
                          >
                            Ablehnen
                          </V28Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </StandardPageLayout>

        {/* Dialogs */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPartner ? "Partner bearbeiten" : "Neuer Partner"}</DialogTitle>
              <DialogDescription>
                Partner können Aufträge ohne eigenen Login-Zugang bearbeiten
              </DialogDescription>
            </DialogHeader>
            <PartnerForm
              partner={editingPartner}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingPartner(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {profile?.company_id && (
          <PartnerRequestDialog
            currentCompanyId={profile.company_id}
            open={showRequestDialog}
            onOpenChange={setShowRequestDialog}
            onSuccess={() => {
              setShowRequestDialog(false);
              toast({
                title: "Erfolg",
                description: "Partner-Anfrage wurde gesendet.",
              });
            }}
          />
        )}

        {/* Detail Dialog */}
        {selectedPartner && (
          <DetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            title={`Partner: ${selectedPartner.name}`}
            onArchive={() => handleArchive(selectedPartner)}
            onEdit={() => {
              handleEdit(selectedPartner);
              setDetailDialogOpen(false);
            }}
            showArchive={true}
            createdAt={selectedPartner.created_at}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <p className="font-medium">{selectedPartner.name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">E-Mail:</span>
                  <p className="font-medium">{selectedPartner.email || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Telefon:</span>
                  <p className="font-medium">{selectedPartner.phone || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Provision:</span>
                  <p className="font-medium">{formatCurrency(selectedPartner.provision_amount)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Online-Zugang:</span>
                  <div className="mt-1">
                    <StatusIndicator
                      type={getPartnerStatusType(selectedPartner.online_access_enabled)}
                      label={selectedPartner.online_access_enabled ? "Aktiv" : "Inaktiv"}
                      size="sm"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Zuletzt aktualisiert:</span>
                  <p className="font-medium">
                    {format(new Date(selectedPartner.updated_at), "dd.MM.yyyy HH:mm", {
                      locale: de,
                    })}{" "}
                    Uhr
                  </p>
                </div>
              </div>
            </div>
          </DetailDialog>
        )}
      </FeatureGate>
    </>
  );
}
