/* ==================================================================================
   KRITISCHER HINWEIS: Kommunikation - DESIGN/LAYOUT FINAL! V18.3 MERGED
   ==================================================================================
   MERGE von Team-Chat + Office (E-Mail & Vorlagen)
   - Tab 1: Team-Chat (WhatsApp-Style, Realtime)
   - Tab 2: E-Mail & Vorlagen (Dokument-Templates)
   - Zentrale Kommunikations-Hub
   - Multi-Tenant mit company_id isolation
   ================================================================================== */

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useChatConsent } from "@/hooks/use-chat-consent";
import { useDocumentTemplates } from "@/hooks/use-document-templates";
import { useEmailTemplates } from "@/hooks/use-email-templates";
import { useTouchTargetValidation } from "@/hooks/validation/useTouchTargetValidation";
import { useMainLayout } from "@/hooks/use-main-layout";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/shared/SEOHead";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { V28Button } from "@/components/design-system/V28Button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { CallInterface } from "@/components/chat/CallInterface";
import { ParticipantSelector } from "@/components/chat/ParticipantSelector";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  MessageSquare,
  Phone,
  Video,
  Plus,
  Users,
  Shield,
  Info,
  Mail,
  FileText,
  FileEdit,
  Send,
  Save,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchParams } from "react-router-dom";
import { formatCurrency } from "@/lib/format-utils";
import { handleError, handleSuccess } from "@/lib/error-handler";

interface Conversation {
  id: string;
  name?: string;
  is_group: boolean;
  created_by: string;
  updated_at: string;
  company_id: string;
  archived: boolean;
  created_at: string;
}

export default function Kommunikation() {
  useTouchTargetValidation();
  const { profile, company, user } = useAuth();
  const { sidebarExpanded } = useMainLayout();
  const { consent, loading: consentLoading, hasActiveConsent, giveConsent } = useChatConsent();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "chat";

  // Chat States
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [activeCall, setActiveCall] = useState<{
    type: "audio" | "video";
    conversationId: string;
    participantName: string;
  } | null>(null);

  // Office/Templates States
  const { templates: documentTemplates = [], isLoading: docLoading } = useDocumentTemplates();
  const { templates: emailTemplates = [], isLoading: emailLoading } = useEmailTemplates();
  const [searchTerm, setSearchTerm] = useState("");
  const [previewDialog, setPreviewDialog] = useState(false);
  const [editDocDialog, setEditDocDialog] = useState(false);
  const [editEmailDialog, setEditEmailDialog] = useState(false);
  const [testEmailDialog, setTestEmailDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    subject: "",
    content: "",
    body: "",
  });

  // Lade Conversations
  useEffect(() => {
    if (profile?.company_id && user?.id && hasActiveConsent) {
      fetchConversations();
    }
  }, [profile?.company_id, user?.id, hasActiveConsent]);

  const fetchConversations = async () => {
    if (!profile?.company_id || !user?.id) return;

    try {
      const { data: participantData, error: participantError } = await supabase
        .from("chat_participants")
        .select("conversation_id")
        .eq("user_id", user.id);

      if (participantError) throw participantError;

      const conversationIds = participantData?.map((p) => p.conversation_id) || [];

      if (conversationIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("company_id", profile.company_id)
        .eq("archived", false)
        .in("id", conversationIds)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      setConversations(data || []);
    } catch (error) {
      handleError(error, "Unterhaltungen konnten nicht geladen werden");
    } finally {
      setLoading(false);
    }
  };

  const handleConversationCreated = (conversationId: string) => {
    setShowNewChatDialog(false);
    fetchConversations();
    const newConv = conversations.find((c) => c.id === conversationId);
    if (newConv) {
      setSelectedConversation(newConv);
    }
  };

  const handleStartCall = (type: "audio" | "video") => {
    if (!selectedConversation) return;
    setActiveCall({
      type,
      conversationId: selectedConversation.id,
      participantName: selectedConversation.name || "Unterhaltung",
    });
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  const handleConversationSelect = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      setSelectedConversation(conversation);
    }
  };

  // Office Template Handlers
  const handleEditDocument = (template: any) => {
    setSelectedTemplate(template);
    setEditForm({
      name: template.name,
      subject: template.subject || "",
      content: template.content,
      body: "",
    });
    setEditDocDialog(true);
  };

  const handleSaveDocument = async () => {
    if (!selectedTemplate) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("document_templates")
        .update({
          name: editForm.name,
          subject: editForm.subject,
          content: editForm.content,
        })
        .eq("id", selectedTemplate.id);

      if (error) throw error;

      handleSuccess("Vorlage wurde gespeichert");
      setEditDocDialog(false);
    } catch (error) {
      handleError(error, "Vorlage konnte nicht gespeichert werden");
    } finally {
      setSaving(false);
    }
  };

  const handleEditEmail = (template: any) => {
    setSelectedTemplate(template);
    setEditForm({
      name: template.name,
      subject: template.subject,
      content: "",
      body: template.body,
    });
    setEditEmailDialog(true);
  };

  const handleSaveEmail = async () => {
    if (!selectedTemplate) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("email_templates")
        .update({
          name: editForm.name,
          subject: editForm.subject,
          body: editForm.body,
        } as any)
        .eq("id", selectedTemplate.id);

      if (error) throw error;

      handleSuccess("E-Mail-Vorlage wurde gespeichert");
      setEditEmailDialog(false);
    } catch (error) {
      handleError(error, "E-Mail-Vorlage konnte nicht gespeichert werden");
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = (template: any) => {
    setSelectedTemplate(template);
    setTestEmail("");
    setTestEmailDialog(true);
  };

  const sendTestEmail = async () => {
    if (!testEmail || !selectedTemplate) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-template-email", {
        body: {
          template_id: selectedTemplate.id,
          recipient_email: testEmail,
          custom_data: {
            customer_name: "Test-Kunde",
            date: new Date().toLocaleDateString("de-DE"),
            price: formatCurrency(99.99),
          },
        },
      });

      if (error) throw error;

      handleSuccess(`Test-E-Mail erfolgreich an ${testEmail} gesendet`);
      setTestEmailDialog(false);
      setTestEmail("");
    } catch (error) {
      handleError(error, "E-Mail konnte nicht versendet werden");
    } finally {
      setSending(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Abrechnung":
        return FileText;
      case "Vertrieb":
        return FileEdit;
      default:
        return Mail;
    }
  };

  // Filtered Templates
  const filteredDocuments = useMemo(
    () => documentTemplates.filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [documentTemplates, searchTerm]
  );

  const filteredEmails = useMemo(
    () => emailTemplates.filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [emailTemplates, searchTerm]
  );

  if (loading || consentLoading) {
    return (
      <>
        <SEOHead
          title="Kommunikation - MyDispatch"
          description="Team-Chat und E-Mail-Vorlagen"
          canonical="/kommunikation"
        />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Lädt...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Kommunikation - MyDispatch"
        description="Team-Chat, Video-Calls und E-Mail-Vorlagen"
        canonical="/kommunikation"
      />

      {/* Active Call Overlay */}
      {activeCall && (
        <CallInterface
          open={true}
          callType={activeCall.type}
          conversationId={activeCall.conversationId}
          participantName={activeCall.participantName}
          onClose={handleEndCall}
        />
      )}

      {/* ✅ MAIN CONTENT */}
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Kommunikation</h1>
          <p className="text-muted-foreground mt-1">
            Team-Chat und E-Mail-Vorlagen zentral verwalten
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          value={currentTab}
          onValueChange={(value) => setSearchParams({ tab: value })}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="min-h-[44px]">
              <MessageSquare className="h-4 w-4 mr-2" />
              Team-Chat
            </TabsTrigger>
            <TabsTrigger value="vorlagen" className="min-h-[44px]">
              <Mail className="h-4 w-4 mr-2" />
              E-Mail & Vorlagen
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: TEAM-CHAT */}
          <TabsContent value="chat" className="space-y-4">
            {!hasActiveConsent ? (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Einwilligung für Team-Chat erforderlich
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Datenschutz-Information</AlertTitle>
                    <AlertDescription>
                      Um den Team-Chat nutzen zu können, benötigen wir Ihre Einwilligung gemäß
                      DSGVO.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <V28Button onClick={giveConsent} className="h-10 px-6" variant="primary">
                      <Shield className="h-4 w-4 mr-2" />
                      Einwilligung erteilen & Chat aktivieren
                    </V28Button>
                    <V28Button
                      variant="secondary"
                      onClick={() => navigate("/einstellungen?tab=privacy")}
                      className="h-10 px-6"
                    >
                      Mehr erfahren
                    </V28Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Chat Action Button */}
                <div className="flex justify-end">
                  <V28Button onClick={() => setShowNewChatDialog(true)} variant="primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Neue Unterhaltung
                  </V28Button>

                  <ParticipantSelector
                    open={showNewChatDialog}
                    onOpenChange={setShowNewChatDialog}
                    onConversationCreated={handleConversationCreated}
                  />
                </div>

                {conversations.length === 0 ? (
                  <Card className="border-2 border-primary bg-primary/10">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-2">Team-Chat aktivieren</h3>
                          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                            Sie haben noch keine Gespräche. Laden Sie Teammitglieder ein.
                          </p>
                        </div>
                        <V28Button
                          size="lg"
                          onClick={() => navigate("/einstellungen?tab=team")}
                          variant="primary"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Team-Mitglieder einladen
                        </V28Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div
                    className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"}`}
                  >
                    {(!isMobile || !selectedConversation) && (
                      <div className="lg:col-span-1">
                        <ConversationList
                          activeConversationId={selectedConversation?.id || null}
                          onSelectConversation={handleConversationSelect}
                        />
                      </div>
                    )}

                    {(!isMobile || selectedConversation) && (
                      <div className="lg:col-span-3">
                        {selectedConversation ? (
                          <Card className="flex flex-col h-[calc(100vh-280px)]">
                            <CardHeader className="border-b py-3 bg-muted/30">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {isMobile && (
                                    <V28Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setSelectedConversation(null)}
                                    >
                                      ← Zurück
                                    </V28Button>
                                  )}
                                  <div>
                                    <CardTitle className="text-lg">
                                      {selectedConversation.name || "Unterhaltung"}
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground mt-0.5">Aktiv</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <V28Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStartCall("audio")}
                                    className="h-9 w-9 p-0"
                                    disabled={true}
                                  >
                                    <Phone className="h-4 w-4" />
                                  </V28Button>
                                  <V28Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStartCall("video")}
                                    className="h-9 w-9 p-0"
                                    disabled={true}
                                  >
                                    <Video className="h-4 w-4" />
                                  </V28Button>
                                </div>
                              </div>
                            </CardHeader>

                            <ChatWindow
                              conversationId={selectedConversation.id}
                              onStartCall={handleStartCall}
                            />
                          </Card>
                        ) : (
                          <Card className="h-[calc(100vh-280px)] flex items-center justify-center">
                            <CardContent className="text-center">
                              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                              <h3 className="text-lg font-semibold mb-2">
                                Keine Unterhaltung ausgewählt
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Wählen Sie eine Unterhaltung aus
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* TAB 2: E-MAIL & VORLAGEN */}
          <TabsContent value="vorlagen" className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Vorlagen durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs defaultValue="documents" className="space-y-4">
              <TabsList>
                <TabsTrigger value="documents">Dokumentvorlagen</TabsTrigger>
                <TabsTrigger value="emails">E-Mail-Vorlagen</TabsTrigger>
              </TabsList>

              {/* Dokumentvorlagen */}
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Dokumentvorlagen</CardTitle>
                    <CardDescription>
                      Professionelle Vorlagen mit Ihren Unternehmensdaten
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {filteredDocuments.length === 0 ? (
                      <EmptyState
                        icon={<FileText className="w-full h-full" />}
                        title={
                          searchTerm ? "Keine Vorlagen gefunden" : "Noch keine Dokumentvorlagen"
                        }
                        description={
                          searchTerm
                            ? "Versuchen Sie eine andere Suche"
                            : "Erstellen Sie Ihre erste Dokumentvorlage"
                        }
                        isSearchResult={!!searchTerm}
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredDocuments.map((template) => {
                          const IconComponent = getCategoryIcon(template.category);
                          return (
                            <Card key={template.id} className="hover:shadow-md transition-shadow">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                      <IconComponent className="h-5 w-5 text-foreground" />
                                    </div>
                                    <div>
                                      <CardTitle className="text-base">{template.name}</CardTitle>
                                      <Badge variant="outline" className="mt-1 text-xs">
                                        {template.category}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {template.content.substring(0, 100)}...
                                </p>
                                <V28Button
                                  size="sm"
                                  variant="secondary"
                                  className="w-full"
                                  onClick={() => handleEditDocument(template)}
                                >
                                  <FileEdit className="mr-2 h-4 w-4" />
                                  Bearbeiten
                                </V28Button>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* E-Mail-Vorlagen */}
              <TabsContent value="emails">
                <Card>
                  <CardHeader>
                    <CardTitle>E-Mail-Vorlagen</CardTitle>
                    <CardDescription>Automatisierte E-Mail-Vorlagen</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {filteredEmails.length === 0 ? (
                      <EmptyState
                        icon={<Mail className="w-full h-full" />}
                        title={
                          searchTerm ? "Keine Vorlagen gefunden" : "Noch keine E-Mail-Vorlagen"
                        }
                        description={
                          searchTerm
                            ? "Versuchen Sie eine andere Suche"
                            : "Erstellen Sie Ihre erste E-Mail-Vorlage"
                        }
                        isSearchResult={!!searchTerm}
                      />
                    ) : (
                      <div className="space-y-3">
                        {filteredEmails.map((template) => (
                          <Card key={template.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Mail className="h-4 w-4 text-foreground" />
                                {template.name}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                <strong>Betreff:</strong> {template.subject}
                              </p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="bg-muted/30 p-3 rounded-md text-sm">
                                <p className="text-muted-foreground italic line-clamp-2">
                                  {template.body}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <V28Button
                                  size="sm"
                                  variant="secondary"
                                  className="flex-1"
                                  onClick={() => handleEditEmail(template)}
                                >
                                  <FileEdit className="mr-2 h-4 w-4" />
                                  Bearbeiten
                                </V28Button>
                                <V28Button
                                  size="sm"
                                  variant="primary"
                                  className="flex-1"
                                  onClick={() => handleTestEmail(template)}
                                >
                                  <Send className="mr-2 h-4 w-4" />
                                  Testen
                                </V28Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Platzhalter Info */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <p className="font-medium mb-2 text-sm">📋 Verfügbare Platzhalter:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <p>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        {"{company_name}"}
                      </code>{" "}
                      - {company?.name}
                    </p>
                    <p>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        {"{company_address}"}
                      </code>{" "}
                      - Adresse
                    </p>
                  </div>
                  <div>
                    <p>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        {"{customer_name}"}
                      </code>{" "}
                      - Kundenname
                    </p>
                    <p>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        {"{pickup_address}"}
                      </code>{" "}
                      - Abholort
                    </p>
                  </div>
                  <div>
                    <p>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">{"{price}"}</code> -
                      Betrag
                    </p>
                    <p>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">{"{date}"}</code> -
                      Datum
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* DIALOGS */}
      {/* Edit Document */}
      <Dialog open={editDocDialog} onOpenChange={setEditDocDialog}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dokumentvorlage bearbeiten</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Vorlagenname</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Betreff (optional)</Label>
              <Input
                value={editForm.subject}
                onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
              />
            </div>
            <div>
              <Label>Inhalt</Label>
              <Textarea
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                rows={15}
                className="font-mono text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <V28Button variant="secondary" onClick={() => setEditDocDialog(false)}>
              Abbrechen
            </V28Button>
            <V28Button onClick={handleSaveDocument} disabled={saving} variant="primary">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Speichert..." : "Speichern"}
            </V28Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Email */}
      <Dialog open={editEmailDialog} onOpenChange={setEditEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>E-Mail-Vorlage bearbeiten</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Vorlagenname</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Betreff</Label>
              <Input
                value={editForm.subject}
                onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
              />
            </div>
            <div>
              <Label>Nachricht</Label>
              <Textarea
                value={editForm.body}
                onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                rows={10}
              />
            </div>
          </div>
          <DialogFooter>
            <V28Button variant="secondary" onClick={() => setEditEmailDialog(false)}>
              Abbrechen
            </V28Button>
            <V28Button onClick={handleSaveEmail} disabled={saving} variant="primary">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Speichert..." : "Speichern"}
            </V28Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Email */}
      <Dialog open={testEmailDialog} onOpenChange={setTestEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test-E-Mail senden</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>E-Mail-Adresse</Label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="beispiel@email.de"
              />
            </div>
          </div>
          <DialogFooter>
            <V28Button variant="secondary" onClick={() => setTestEmailDialog(false)}>
              Abbrechen
            </V28Button>
            <V28Button onClick={sendTestEmail} disabled={sending || !testEmail} variant="primary">
              <Send className="mr-2 h-4 w-4" />
              {sending ? "Sendet..." : "Test senden"}
            </V28Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ V37.0: RIGHT SIDEBAR - Fixed 320px (hidden < 768px) */}
      {!isMobile && (
        <aside className="fixed right-0 top-16 bottom-0 w-80 bg-background border-l border-border shadow-lg z-20 overflow-y-auto hidden md:block transition-all duration-300">
          {/* Schnellzugriff */}
          <div className="p-4 space-y-3 border-b border-border">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-slate-700" />
              Schnellzugriff
            </h3>

            <V28Button
              variant="primary"
              fullWidth
              icon={MessageSquare}
              onClick={() => setShowNewChatDialog(true)}
            >
              Neuer Chat
            </V28Button>

            <V28Button
              variant="secondary"
              fullWidth
              icon={Mail}
              onClick={() => setEditEmailDialog(true)}
            >
              Nachricht senden
            </V28Button>
          </div>

          {/* Live-Status Stats */}
          <div className="p-4 space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              Live-Status
            </h4>

            <div className="p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">Aktive Chats</span>
                <MessageSquare className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {conversations.filter((c) => !c.archived).length}
              </p>
            </div>

            <div className="p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">E-Mail Vorlagen</span>
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{emailTemplates.length}</p>
            </div>

            <div className="p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">Dokument-Vorlagen</span>
                <FileText className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{documentTemplates.length}</p>
            </div>

            <div className="p-3 bg-status-success/10 rounded-lg border border-status-success/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-status-success">Chat-Zustimmung</span>
                <Shield className="h-4 w-4 text-status-success" />
              </div>
              <p className="text-sm font-bold text-green-900">
                {hasActiveConsent ? "Erteilt" : "Ausstehend"}
              </p>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
