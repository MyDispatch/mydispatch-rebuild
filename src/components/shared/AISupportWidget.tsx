/* ==================================================================================
   AI-SUPPORT-WIDGET COMPONENT
   ==================================================================================
   - Floating Support-Chat mit AI
   - Kontext-sensitiv basierend auf aktueller Seite
   - Streaming-Antworten
   ================================================================================== */

import React, { useState, useEffect, useRef } from "react";
import { V28Button } from "@/components/design-system/V28Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/lib/compat";
import { MessageCircle, X, Send, Bot, User, Crown, TrendingUp, AlertTriangle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAccountType } from "@/hooks/use-account-type";
import { useAuth } from "@/hooks/use-auth";
import { handleError } from "@/lib/error-handler";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AISupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { permissions } = useAccountType();
  const { profile, company } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getPageContext = () => {
    const path = location.pathname;
    const contexts: Record<string, string> = {
      "/": "Dashboard - Übersicht über Aufträge, Fahrer und Fahrzeuge",
      "/auftraege": "Auftragsverwaltung - Buchungen anlegen und verwalten",
      "/fahrer": "Fahrerverwaltung - Fahrer anlegen und organisieren",
      "/fahrzeuge": "Fahrzeugverwaltung - Fahrzeugflotte verwalten",
      "/kunden": "Kundenverwaltung - Kunden anlegen und pflegen",
      "/partner": "Partner-Netzwerk - Kooperationen verwalten",
      "/schichtzettel": "Schichtzettel - Schichten dokumentieren",
      "/rechnungen": "Rechnungsverwaltung - Rechnungen erstellen",
      "/statistiken": "Statistiken - Auswertungen und Analysen",
      "/unternehmen": "Unternehmenseinstellungen",
      "/master-dashboard": "Master-Dashboard - Alle Unternehmen verwalten",
    };
    return contexts[path] || "MyDispatch Dashboard";
  };

  const masterQuickActions = [
    {
      icon: AlertTriangle,
      label: "Gefährdete Accounts",
      prompt:
        "Analysiere alle Companies: Welche sind gefährdet durch Zahlungsverzug, geringe Nutzung oder Support-Tickets? Sortiert nach Kündigungsrisiko.",
    },
    {
      icon: TrendingUp,
      label: "Top Performer",
      prompt:
        "Zeige die Top 10 Companies nach Umsatz, Aufträgen und Nutzungsintensität. Welche Erfolgsfaktoren haben diese?",
    },
    {
      icon: Crown,
      label: "Upselling-Chancen",
      prompt:
        "Welche Starter-Accounts sollten auf Business upgraden? Analysiere Nutzung, Fahreranzahl und Feature-Bedarf.",
    },
  ];

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-support-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY}`,
          },
          body: JSON.stringify({
            messages: messages.concat(userMessage).map((m) => ({
              role: m.role,
              content: m.content,
            })),
            context: `Aktuelle Seite: ${getPageContext()}`,
            isMasterAccount: permissions.canAccessMasterDashboard,
            companyId: company?.id,
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Fehler beim Abrufen der Antwort");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = assistantContent;
                return newMessages;
              });
            }
          } catch {
            // Incomplete JSON, put it back
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      handleError(error, "AI-Chat Fehler");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <V28Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
          aria-label="AI-Support öffnen"
        >
          <Bot className="h-6 w-6 text-primary-foreground" />
        </V28Button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between p-4 pb-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-base">MyDispatch AI-Support</CardTitle>
            </div>
            <V28Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </V28Button>
          </CardHeader>

          {/* EU AI Act 2024/1689 Art. 50 & 52 Transparenz-Hinweis */}
          <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground">
            ℹ️ AI-System: Gemini 2.5 Flash | Zweck: Support & Analyse |{" "}
            <a href="/datenschutz" target="_blank" className="underline hover:text-foreground">
              Datenschutz
            </a>
          </div>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 mt-px">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm mt-8">
                {permissions.canAccessMasterDashboard ? (
                  <Crown className="h-12 w-12 mx-auto mb-4 text-foreground" />
                ) : (
                  <Bot className="h-12 w-12 mx-auto mb-4 text-foreground" />
                )}
                <p className="font-semibold mb-2">
                  {permissions.canAccessMasterDashboard
                    ? "Master AI-Assistent"
                    : "Wie kann ich Ihnen helfen?"}
                </p>
                <p className="text-xs mb-4">
                  {permissions.canAccessMasterDashboard
                    ? "Terminierung, Performance-Analyse, Churn-Prediction und Upselling."
                    : "Ich beantworte Fragen zur Software, helfe bei der Disposition und gebe Optimierungsempfehlungen."}
                </p>

                {/* Master Quick Actions */}
                {permissions.canAccessMasterDashboard && (
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    {masterQuickActions.map((action, idx) => (
                      <V28Button
                        key={idx}
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setInput(action.prompt);
                          setTimeout(() => sendMessage(), 100);
                        }}
                        className="text-left justify-start gap-2 h-auto py-2 px-3"
                      >
                        <action.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs">{action.label}</span>
                      </V28Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-2 items-start",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="bg-primary rounded-full p-2 flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-[80%] text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="bg-foreground rounded-full p-2 flex-shrink-0">
                    <User className="h-4 w-4 text-background" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-start justify-start">
                <div className="bg-primary rounded-full p-2">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <div className="flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                      ●
                    </span>
                    <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                      ●
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-4 pt-4 mt-px">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nachricht eingeben..."
                disabled={isLoading}
                className="flex-1"
              />
              <V28Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </V28Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
